var Movie = require('../models/movies'),
    Comment = require('../models/comment'),
    User  = require('../models/user');

var middleWareObj = {};

middleWareObj.checkReviewOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash('error', 'Review not found!');
                return next();
            } else{
                if(foundComment.auther.id.equals(req.user._id) || req.user.role === 'admin'){
                    next();
                } else{
                    req.flash('error', 'You do not have permission to do this action.')
                    res.redirect('back');
                }
            }
        });
    }else{
        req.flash('error', 'You need to sign in first!');
        res.redirect('back');
    } 
}

middleWareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to sign in first!');
    res.redirect('/logIn');
}

module.exports = middleWareObj;