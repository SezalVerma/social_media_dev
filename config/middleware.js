// custom middleware

// send flash msg from req object to res 
module.exports.setFlash = function(req,res,next){
    res.locals.flash = {
        // when event is a success , display flash msg with success keyword
        'success' : req.flash('success'),
        'error'   : req.flash('error'),
    };
    next();
}