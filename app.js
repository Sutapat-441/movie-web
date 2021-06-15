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
      Cinema        = require('./models/cinema'),
      Schedule      = require('./models/schedule'),
      middleware    = require('./middleware'),
      Major         = require('./models/major'),
      Admin         = require('./models/admin'),
      seedDB        = require('./seeds');

var moviesRoutes    = require('./routes/movies'),
    reviewRoutes    = require('./routes/reviews'),
    indexRoutes     = require('./routes/index'),
    reserveRoutes   = require('./routes/reserve'),
    adminRoutes     = require('./routes/admin');


mongoose.connect('mongodb://localhost/myMovieProject',{
    useCreateIndex: true,
    useNewUrlParser: true
});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
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


app.use(function(req,res,next){
    res.locals.currentUser = req.user;//ตัวบอกว่าuserปัจจุบันคือใคร
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


app.use('/', indexRoutes);
app.use('/movies', moviesRoutes);
app.use('/movies/:id/review', reviewRoutes);
app.use('/reserve', reserveRoutes);
// app.use('/admin',adminRoute);


app.get('/theaters',function(req,res){
    Movie.find({},function(err,allMovies){//หาข้อมูลทั้งหมดในMovie,ถ้าหาเจอก็เก็บไว้ในตัวแปรallMovies
        if(err){
            console.log(err);
        }else{
            res.render('theater.ejs', {movies: allMovies});
        }
    });
});

app.get('/user/:id',async function(req,res){
    let user = await User.findById(req.params.id).populate([
        {
            path: 'like'
        }, {
            path: 'booking.schedule',
            populate: {
                        path: 'movie'
                    }
        }]).exec();
    res.render('user/profileUser.ejs', {user:user});
});

app.get('/history',function(req,res){
    res.render('history.ejs');
});

app.get('/favorite',function(req,res){
    res.render('favorite.ejs');
});

app.get('/schedule/new',middleware.checkAdmin, async function(req,res){
    let movieDesc = await Movie.find({}).exec();//วิธีการหาแล้วreturnค่าได้แล้วเอามาเก็บไว้ข้างนอก(ต้องเป็นfn async)
    let cinemaDesc = await Cinema.find({}).populate('major').exec();
    console.log(cinemaDesc);
    res.render('./admin/addSchedule.ejs', {movies:movieDesc, cinemas:cinemaDesc});
});

app.post('/schedule/new', function(req,res){
    console.log(req.body);
    Schedule.create(
        {
            showtime:req.body.schedule.showtime,
            movie:req.body.schedule.movie,
            cinema:req.body.schedule.cinema
        },
        function(err,newSchedule){
            if(err){
                console.log(err);
                res.redirect('back');
            }else{
                Cinema.findById(newSchedule.cinema, function(err,foundCinema){
                    if(err){
                        console.log(err);
                    } else{
                        foundCinema.seat.forEach(seatId => {
                            let seat = {
                                seat_id:seatId,
                                available:true
                            };
                            newSchedule.seat.push(seat);     
                        });
                     Major.update({_id:foundCinema.major},{$push:{schedule:newSchedule._id}}).exec();
                     newSchedule.save(); 
                     res.redirect('back');//อนาคตต้องredirectไปหน้าadmin
                    }
            })//สร้างseat ให้scheduleต้องหาในcinema
        }
    })
});

app.get('/cinema/new',async function(req,res){
    let movies = await Movie.find({}).exec();
    let major = await Major.find({}).exec();
    res.render('./admin/addCinema.ejs', {major:major, movies:movies});
});

app.post('/cinema/new',async function(req,res){
    let seatPlace = [];
    for(i=0;i<req.body.cinema.row;i++){
        let char =String.fromCharCode(65+i);
        for(j=1;j<=req.body.cinema.column;j++){
            let result = char + j;
            seatPlace.push(result);
        }
    }
    Cinema.create(
        {
            name:req.body.cinema.name,
            system:req.body.cinema.system,
            major:req.body.cinema.major,
            seat:seatPlace
        },
            function(err,newCinema){
                if(err){
                    console.log(err);
                    res.redirect('back');
                } else{
                    Major.update({_id:newCinema.major},{$push:{cinema:newCinema._id}}).exec();
                    console.log(newCinema.name + ' Cinema created.');
                    res.redirect('/');
                }
        })
});

app.get('/major/new', function(req,res){
    res.render('./admin/newMajor.ejs');
});

app.post('/major/new',function(req,res){
    Major.create(
        {
            name:req.body.major.name
        }, function(err,newMajor){
        if(err){
            console.log(err);
        }else{
            console.log(newMajor.name + ' Major Created.');
            newMajor.save();
            res.redirect('/');
        }
    })
});

app.post('/confirm/reserve/:id/payment',middleware.isLoggedIn, function(req,res){
    let selectedseat = [];
    if(!Array.isArray(req.query.selectedseat)){
        selectedseat.push(req.query.selectedseat);
    } else{
        selectedseat = req.query.selectedseat;
    }
    Schedule.updateMany(
        {//query 
            _id:req.params.id
        },
        {//update operation
            $set: {
                "seat.$[elem].available": false,
                "seat.$[elem].reserver": req.user._id
            }
        },
        {//option
            arrayFilters:[{"elem.seat_id": {$in: selectedseat},"elem.available":true}]
        },function(err, updatedSchedule){
            if(err){
                console.log(err);
            } else {
                User.findById(req.user._id ,function(err,foundUser){
                    if(err){
                        console.log(err);
                    } else{

                        foundUser.booking.push({schedule:req.params.id,seat:selectedseat});
                        foundUser.save();
                        res.redirect('/reserve/'+req.params.id+'/success');
                    }
                })
            }
        });
    });

app.listen(3000,function(){
    console.log('Server myMovieProject is running . . .');
});