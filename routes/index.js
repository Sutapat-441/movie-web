var express = require('express'),
    router  = express.Router(),
    Movie   = require('../models/movies'),
    User    = require('../models/user'),
    passport= require('passport'),
    multer  = require('multer'),
    path    = require('path'),
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
    Comment = require('../models/comment');

// Comment.remove({},function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log('remove success');
//     }
// });

// Admin.create(req.body,function(err,newadmin){
//     if(err){
//         console.log(err);
//     }else{
//         newadmin.aadminname.id = req.

//     }
// })

router.get('/',function(req,res){
    Movie.find({},function(err,allMovies){
        if(err){
            console.log(err);
        }else{
            User.find({}, function(err,foundUser){
                if(err){
                    console.log(err);
                } else {
                    console.log(foundUser);
                    res.render('Home.ejs' , {movies: allMovies, user:foundUser});
                }
            })
            
        }
    });
});

router.get('/signUp',function(req,res){
    res.render('SignUp.ejs');
});

router.post('/signUp', uploads.single('profileImage'), function(req,res){
    req.body.profileImage = '/uploads/' + req.file.filename;
    var newUser = new User({
        username:req.body.username, 
        phone:req.body.phone, 
        email:req.body.email,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        profileImage:req.body.profileImage
    });
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash('error', err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req,res, function(){//check password
            req.flash('success', 'Welcome to Cineflix'+ user.username);
            res.redirect('/movies');
        });
    });
});

router.get('/logIn',function(req,res){
    res.render('LogIn.ejs');
});

router.post('/logIn' ,passport.authenticate('local',
    {
        successRedirect:'/movies',
        failureRedirect:'/login',
        successFlash: true,
        failureFlash: true,
        successFlash: 'Successfully log in',
        failureFlash: 'Invalid username or password'
    }),function(req,res){
        console.log(req.body);
});


router.get('/adminLogin',function(req,res){
    res.render('adminLogin.ejs');
});

router.post('/adminLogin', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/adminLogin');}
      if (user.role !== 'admin'){return res.redirect('/adminLogin');}

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/movies');
      });
    })(req, res, next);
  });
// router.post('/adminLogin',passport.authenticate('local',
// {
//     failureRedirect:'/login'
//     }),function(req,res){
//         if(req.user.role=='admin'){
//             res.redirect('/movies');
//         }
//         res.redirect('/');
//     console.log(req.body);
// })

router.get('/regAdmin',function(req,res){
    res.render('regtoAdmin.ejs');
});

router.post('/regAdmin',function(req,res){
    var newAdmin = new User({username:req.body.username, phone:req.body.phone, email:req.body.email, role:'admin'});
    User.register(newAdmin,req.body.password,function(err,admin){
        if(err){
            console.log(err);
            res.redirect('/regAdmin');
        }
        console.log('Reg to Admin success.'+admin.username);
        passport.authenticate('local')(req,res, function(){//check password
            res.redirect('/movies');
        });
    });
});

router.get('/admin',function(req,res){
    res.render('./admin/admin.ejs');
});


router.get('/logout',function(req,res){
    req.logout();
    req.flash('success', 'Logged you out successfully');
    res.redirect('/');
});

module.exports = router;
