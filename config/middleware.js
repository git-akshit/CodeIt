//creating a middleware for flash messages
//it will take out the request messages and put it in session
//using connect flas because it stores in session and releases for next time
module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }

    next();
}