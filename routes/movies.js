const { response } = require('express');

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

router.post('/',middleware.isLoggedIn, uploads.single('image'), function(req,res){//รับข้อมูล
    req.body.movies.image = '/upload/'+ req.file.filename//สร้าง path ไป folder upload
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
    res.render('./movies/addMovies.ejs');
});

router.get('/:id',function(req,res){
    Movie.findById(req.params.id).populate('comment').exec(function(err,foundMovie){//ส่งข้อมูลแบบให้มันไปถึงทั้งcommentกับmovies(join)
        if(err){
            console.log(err);
        }else{
            res.render('./movies/eachMovies.ejs',{movies: foundMovie});
        }
    });
});

// router.get('/selectSeat',isLoggedIn,function(req,res){
//     res.render('movies/selectSeat.ejs');
// });

router.get('/:id/edit', function(req,res){
    Movie.findById(req.param.id, function(err,foundMovie){
        if(err){
            console.log(err);
        } else{
            res.render('./movies/editMovie.ejs',{movies: foundMovie});
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


//ทำส่วนนี้ให้เป็นของ Admin


router.delete('/:id',middleware.checkReviewOwner, function(req,res){
    Comment.findOneAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/movies/');
        } else{
            req.flash('success','You deleted your review.');
            res.redirect('/movies/');
        }
    });
});


router.post('/search',function(req,res){
    Movie.findOne( { $or : [{ name: req.body.movieSearch }, {type: req.body.movieSearch} ]},function(err,searchMovie){
        if(err){
            console.log(err);
        }else{
            console.log(searchMovie);
            res.redirect('/'+searchMovie._id);
        }
    } );
    //Movie.listIndexes();
    // console.log(req.body);
});

// function isAdmin(req,res,next){
//     Admin.find({},function(err,allAdmin){
//         if(err || req.isAuthenticated()){
//             console.log(err);
//             return next();
//         }
//         res.redirect('/logIn');
//     })
// }

module.exports = router;