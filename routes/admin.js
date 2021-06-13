// var express = require('express'),
//     Movie         = require('./models/movies'),
//     Comment       = require('./models/comment'),
//     User          = require('./models/user'),
//     Cinema        = require('./models/cinema'),
//     Schedule      = require('./models/schedule'),
//     Major         = require('./models/major');


// app.get('/schedule/new',async function(req,res){
//     let movieDesc = await Movie.find({}).exec();//วิธีการหาแล้วreturnค่าได้แล้วเอามาเก็บไว้ข้างนอก(ต้องเป็นfn async)
//     let cinemaDesc = await Cinema.find({}).exec();
//     res.render('./movies/addSchedule.ejs', {movies:movieDesc, cinemas:cinemaDesc});
// });

// app.post('/schedule/new', function(req,res){
//     console.log(req.body);
//     Schedule.create(
//         {
//             showtime:req.body.schedule.showtime,
//             movie:req.body.schedule.movie,
//             cinema:req.body.schedule.cinema
//         },
//         function(err,newSchedule){
//             if(err){
//                 console.log(err);
//                 res.redirect('back');
//             }else{
//                 Cinema.findById(newSchedule.cinema, function(err,foundCinema){
//                     if(err){
//                         console.log(err);
//                     } else{
//                         foundCinema.seat.forEach(seatId => {
//                             let seat = {
//                                 seat_id:seatId,
//                                 available:true
//                             };
//                             newSchedule.seat.push(seat);     
//                         });
//                      Major.update({_id:foundCinema.major},{$push:{schedule:newSchedule._id}}).exec();
//                      newSchedule.save(); 
//                      res.redirect('/');//อนาคตต้องredirectไปหน้าadmin
//                     }
//             })//สร้างseat ให้scheduleต้องหาในcinema
//         }
//     })
// });

// app.get('/cinema/new', async function(req,res){
//     let major = await Major.find({}).exec();
//     res.render('./movies/addCinema.ejs', {major:major});
// });

// app.post('/cinema/new',async function(req,res){
//     let seatPlace = [];
//     for(i=0;i<req.body.cinema.row;i++){
//         let char =String.fromCharCode(65+i);
//         for(j=1;j<=req.body.cinema.column;j++){
//             let result = char + j;
//             seatPlace.push(result);
//         }
//     }
//     let major = await Major.findOne({name:req.body.cinema.address}).exec();
//     Cinema.create(
//         {
//             name:req.body.cinema.name,
//             system:req.body.cinema.system,
//             major:major._id, 
//             seat:seatPlace
//         },
//             function(err,newCinema){
//                 if(err){
//                     console.log(err);
//                     res.redirect('back');
//                 } else{
//                     Major.update({_id:newCinema.major},{$push:{cinema:newCinema._id}}).exec();
//                     console.log(newCinema.name + ' Cinema created.');
//                     res.redirect('/');
//                 }
//         })
//     // console.log(seatPlace);
//     // console.log(req.body);
// });

// app.get('/major/new', function(req,res){

//     res.render('./movies/newMajor.ejs');
// });

// app.post('/major/new',function(req,res){
//     Major.create(
//         {
//             name:req.body.major.name
//         }, function(err,newMajor){
//         if(err){
//             console.log(err);
//         }else{
//             console.log(newMajor.name + ' Major Created.');
//             newMajor.save();
//             res.redirect('/');
//         }
//     })
// });

// module.exports = router;