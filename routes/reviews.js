var express = require('express'),
    router  = express.Router({mergeParams:true}),
    Movie   = require('../models/movies'),
    middleware = require('../middleware'),
    Comment = require('../models/comment');

router.get('/new',middleware.isLoggedIn,function(req,res){
    Movie.findById(req.params.id, function(err,foundMovie){//ส่งข้อมูลแบบให้มันไปถึงทั้งcommentกับmovies(join)
        if(err){
            console.log(err);
        }else{
            res.render('comment/newComment.ejs',{movies: foundMovie});
        }
    });
});

router.post('/',middleware.isLoggedIn,function(req,res){
    Movie.findById(req.params.id, function(err,foundMovie){
        if(err){
            console.log(err);
            res.redirect('/movies');
        }else{
            Comment.create(req.body.comment, function(err,review){
                if(err){
                    console.log(err);
                }else{
                    review.author.id = req.user._id;
                    review.author.username = req.user.username;
                    review.save();
                    foundMovie.comment.push(review);
                    foundMovie.save();
                    req.flash('success', 'Your review is added.')
                    res.redirect('/movies/'+foundMovie._id);//redirectมาที่หน้าเดิม
                }
            });
        }
    });
});

router.get('/:comment_id/edit', middleware.checkReviewOwner, function(req,res){
    Comment.findById(req.params._id, function(err,foundComment){
        if(err){
            res.redirect('back');
        } else{
            res.redirect('comment/edit.ejs', {movies_id: req.params.id, comment: foundComment});
        }
    });
});

router.put('/:comment_id', middleware.checkReviewOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else{
            res.redirect('/movies/'+ req.params.id);
        }
    });
});

router.delete('/:id',middleware.checkReviewOwner, function(req,res){//ลบแต่หน้านั้นยังไม่หาย
    Comment.findOneAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        } else{
            res.redirect('/movies/' +req.params.id);
        }
    });
});

module.exports = router;