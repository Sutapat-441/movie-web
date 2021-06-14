const movies = require('../models/movies');

var express = require('express'),
    router  = express.Router(),
    multer  = require('multer'),
    path    = require('path'),
    middleware = require('../middleware'),
    storage = multer.diskStorage({
                destination: function(req, file, callback){
                    callback(null,'./public/uploads/');//เก็บที่ไหน
                },
                filename: function(req, file, callback){
                    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));//เก็บเวลาที่อัพเดต กับ นามสกุลไฟล์
                }
            }),
    imageFilter = function(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
        return callback(new Error('Only JPG,JPEG,PNG and GIF image files are allowed!'),false);
        }
        callback(null, true);
    },
    uploads = multer({storage: storage, fileFilter: imageFilter}), 
    Movie   = require('../models/movies'),
    Comment = require('../models/comment'),
    Like    = require('../models/like'),
    Schedule= require('../models/schedule'),
    Major = require('../models/major'),
    Admin   = require('../models/admin');

router.get('/',function(req,res){
    Movie.find({},function(err,allMovies){//หาข้อมูลทั้งหมดในMovie,ถ้าหาเจอก็เก็บไว้ในตัวแปรallMovies
        if(err){
            console.log(err);
        }else{
            res.render('movies/movies.ejs', {movies: allMovies});
        }
    });
});    

router.post('/new',middleware.isLoggedIn, uploads.single('image'), function(req,res){//รับข้อมูล
    req.body.movies.image = '/uploads/'+ req.file.filename//สร้าง path ไป folder upload
    //var name = req.body.name;//สร้างตัวแปรมารับข้อมูล
    // var image = req.body.image;
    // var type = req.body.type;
    // var time = req.body.time;
    // var language = req.body.language;
    // var author = {
    //     id: req.user._id,
    //     username: req.user.username
    // };
    //var newMovie = {name:name, image:image, type:type, time:time, language:language};
    Movie.create(req.body.movies,function(err,newlyMovie){
        if(err){
            console.log(err);
        }else{
            req.flash('success','Your Movie is created.');
            res.redirect('/movies');
        }
    });
});

router.get('/new',middleware.isLoggedIn,function(req,res){
    Movie.find({},function(err,allMovies){//หาข้อมูลทั้งหมดในMovie,ถ้าหาเจอก็เก็บไว้ในตัวแปรallMovies
        if(err){
            console.log(err);
        }else{
            res.render('./admin/addMovies.ejs', {movies: allMovies});
        }
    });
});



router.get('/:id',function(req,res){
    Movie.findById(req.params.id).populate('comment').exec(function(err,foundMovie){//ส่งข้อมูลแบบให้มันไปถึงทั้งcommentกับmovies(join)
        console.log(foundMovie);
        if(err){
            console.log(err);
        }else{
            Movie.find({},function(err,allMovies){
                if(err){
                    console.log(err);
                } else{
                    res.render('./movies/eachMovies.ejs', {movies:foundMovie, allmovies:allMovies});
                }
            })
        }
    });
});



// router.get('/selectSeat',isLoggedIn,function(req,res){
//     res.render('movies/selectSeat.ejs');
// });

router.get('/:id/edit', function(req,res){
    Movie.findById(req.params.id, function(err,foundMovie){
        console.log(foundMovie);
        if(err){
            console.log(err);
        } else{
            res.render('./movies/edit.ejs',{movies: foundMovie});
        }
    });
});

router.put('/:id', uploads.single('image'), function(req,res){
    if(req.file){
        req.body.movies.image = '/upload' +req.file.fieldname;
    }
    Movie.findByIdAndUpdate(req.params.id, req.body.movies, function(err, updatedMovie){
        if(err){
            res.redirect('/movies/');
        }else{
            res.redirect('/movies/'+req.params.id);
        }
    });
});

router.post('/:id/schedule', function(req,res){
    let date = new Date(req.body.date);
    date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 );
    let limitDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
    limitDate.setTime( limitDate.getTime() - limitDate.getTimezoneOffset()*60*1000 );
    Schedule.find({
        $and:[{showtime:{$gte:date}},{showtime:{$lt:limitDate}},{movie:req.params.id}] //ด้านในทุกตัวเชื่อมด้วย and
    }).populate('movie cinema').exec(function(err , foundSchedule){
        if(err){
            console.log(err);
        } else{
            let schedule_id = [];
            foundSchedule.forEach(schedule=>{
                schedule_id.push(schedule._id);
            })
            Major.find({
                schedule:{$in:schedule_id}
            },function(err,foundMajor){
                if(err){
                    console.log(err); 
                } else{
                    console.log(foundSchedule);
                    res.render('partials/displaySchedule.ejs', {schedule: foundSchedule, major:foundMajor});
                }
            })
        }
    });
});

//ทำส่วนนี้ให้เป็นของ Admin

router.delete('/:id',middleware.checkAdmin,async function(req,res){
    let movies_id = req.params.id;
    let movies = await Movie.findById(req.params.id).exec();
    if(movies._id.equals(movies_id)){
        Movie.findByIdAndRemove(req.params.id, function(err){
            if(err){
                res.redirect('/movies/');
            } else{
                req.flash('success','You deleted this movie.');
                res.redirect('/movies/');
            }
        });   
    }
   
});

// router.delete('/:id',middleware.checkReviewOwner, function(req,res){
//     Comment.findOneAndRemove(req.params.id, function(err){
//         if(err){
//             res.redirect('/movies/');
//         } else{
//             req.flash('success','You deleted your review.');
//             res.redirect('/movies/');
//         }
//     });
// });

// router.get('/search/:id',function(req,res){
//     if(req.params.id.equals(req.body.movieSearch.id)){
//         Movie.findById(req.body.movieSearch, function(err,foundMovie){
//             if(err){
//                 console.log(err);
//             }else{
//                 res.render('./movies/movies.ejs', {movies:foundMovie});
//             }
//         })  
//     }
// })

router.get('/search/:name', function(req,res){
    let movies = [];
    Movie.findById(req.params.name, function(err, foundMovies){
        movies.push(foundMovies);
        if(err){
            console.log(err);
        } else {
            console.log(movies);
            res.render('./movies/movies.ejs', {movies: movies});
        }
    });
});

// router.post('/serach', function(req,res){
//     var name = req.body.movieSearch;
//     res.redirect('/movies/search/'+name);
// });

router.post('/search',function(req,res){
    Movie.findOne( { $or : [{ name: req.body.movieSearch }, {type: req.body.movieSearch} ]},function(err,searchMovie){
        if(err){
            console.log(err);
        }else{
            console.log(searchMovie);
            res.redirect('/movies/search/'+searchMovie._id);
        }
    } );
    //Movie.listIndexes();
    // console.log(req.body);
});

router.post('/:id/like', middleware.isLoggedIn, function(req,res){
    Movie.findById(req.params.id, function(err, foundMovie){
        if(err){
            console.log(err);
        } else{
            User.findById(req.user._id, function(err,foundUser){
                if(err){
                    console.log(err);
                    res.redirect('/')
                } else{
                        foundUser.like.push(foundMovie)
                        foundUser.save();
                        res.redirect('back');
                    }
                })
            }
        })
});

router.post('/:id/unlike', middleware.isLoggedIn, function(req,res){
    Movie.findById(req.params.id, function(err,foundMovie){
        if(err){
            console.log(err);
        } else{
            User.findById(req.user._id, function(err,foundUser){
                if(err){
                    console.log(err);
                    res.redirect('/');
                } else{
                    foundUser.like.pull(req.params.id);
                    foundUser.save();
                    res.redirect('back');
                }
            })
        }
    })
});




module.exports = router;