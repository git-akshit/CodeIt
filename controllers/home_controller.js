//multiple actions form controller

//an action
module.exports.home = function(req, res){ //exporting the home function
    //console.log('user_id',25);
    return res.render('home', { //name of html ejs file
        title:"Home"
    });
}

// module.exports.actionName = function(req, res){}
