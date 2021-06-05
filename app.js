const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      flash         = require('connect-flash'),
      methodOverride= require('method-override');
      passport      = require('passport'),
      adminPasssport= require('passport'),
      LocalStrategy = require('passport-local');
      Movie         = require('./models/movies'),
      Comment       = require('./models/comment'),
      User          = require('./models/user'),
      Admin         = require('./models/admin'),
      seedDB        = require('./seeds');

var moviesRoutes    = require('./routes/movies'),
    reviewRoutes    = require('./routes/reviews'),
    indexRoutes     = require('./routes/index');

mongoose.connect('mongodb://localhost/myMovieProject',{
    useCreateIndex: true,
    useNewUrlParser: true
});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(flash());
//seedDB();//ข้อมูลเริ่มต้น ถ้าโอเคกับข้อมูลอย่าลืมเอาออกด้วยนะ
console.log(Movie.listIndexes());

app.use(require('express-session')({
    secret: 'secret is always secreat.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//อ้างอิงuserปัจจุบัน


// mongoose.connection.collections['movies'].drop( function(err) {
//     console.log('collection dropped');
// });


app.use(function(req,res,next){
    res.locals.currentUser = req.user;//ตัวบอกว่าuserปัจจุบันคือใคร
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


app.use('/', indexRoutes);
app.use('/movies', moviesRoutes);
app.use('/movies/:id/review', reviewRoutes);


app.get('/theaters',function(req,res){
    res.render('theater.ejs');
});

app.get('/user/:id',function(req,res){
    User.findById(req.param.id, function(err, foundUser){
        if(err){
            req.flash('error', 'There is something wrong.');
            return res.redirect('/');
        } 
        Movie.find().where('author.id').equals(foundUser._id).exec(function(err, foundMovie){//
            if(err){
                req.flash('error', 'There is something wrong.');
                return res.redirect('/');
            }
            res.render('profileUser.ejs', {user: foundUser, movies: foundMovie});
        })
    });
});

app.get('/history',function(req,res){
    res.render('history.ejs');
});

app.get('/favorite',function(req,res){
    res.render('favorite.ejs');
});

app.listen(3000,function(){
    console.log('Server myMovieProject is running . . .');
});