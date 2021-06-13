var express = require('express'),
    router  = express.Router(),
    middleware = require('../middleware'),
    Movie   = require('../models/movies'),
    Comment = require('../models/comment'),
    Like    = require('../models/like'),
    Schedule= require('../models/schedule'),
    Major = require('../models/major');


router.get('/:id/seat',middleware.isLoggedIn,function(req,res){
    Schedule.findById(req.params.id).populate('movie cinema').exec(function(err, foundSchedule){
        if(err){
            console.log(err);
            res.redirect('back');
        } else{
            res.render('./movies/reserve.ejs', {schedule:foundSchedule});
        }
    })
});

router.get('/:id/payment',middleware.isLoggedIn,function(req,res){
    Schedule.findById(req.params.id).populate('movie cinema').exec(function(err,foundSchedule){
        if(err){
            console.log(err);
            res.redirect('back');
        } else{
            let selectedseat = [];
            if(!Array.isArray(req.query.selectedseat)){
                selectedseat.push(req.query.selectedseat);
            } else{
                selectedseat = req.query.selectedseat;
            }
            res.render('./movies/payment.ejs', {schedule:foundSchedule, selectedseat:selectedseat, pathname:req.originalUrl});
        }
    })
})

router.post('/:id/payment',middleware.isLoggedIn,function(req,res){
    Schedule.findById(req.params.id).populate('movie cinema').exec(function(err,foundSchedule){
        if(err){
            console.log(err);
            res.redirect('back');
        } else{
            if(req.body.selectedseat.length < 1) {
                res.redirect('back');
            }else if(!Array.isArray(req.body.selectedseat)) {
                res.redirect('/reserve/'+req.params.id+'/payment?selectedseat='+ req.body.selectedseat);
            }else {
                let seat_qeury_url = "?"
                console.log(!Array.isArray(req.body.selectedseat));
                if(!Array.isArray(req.body.selectedseat)) res.redirect('/reserve/'+req.params.id+'/payment?selectedseat='+ req.body.selectedseat);
                for(let i = 0; i < req.body.selectedseat.length; i++){
                    let sym = "&";
                    if(i==0) sym = "";
                    seat_qeury_url += sym +'selectedseat=' + req.body.selectedseat[i];
                }
                res.redirect('/reserve/'+req.params.id+'/payment'+ seat_qeury_url);
            }
        }
    })
});

router.get('/:id/success', function(req,res){
    res.render('./movies/confirmed.ejs');
});



module.exports = router;