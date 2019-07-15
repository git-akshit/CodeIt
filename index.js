const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

app.use(express.urlencoded());//reading from the post requests
//cookies are read from middleware
app.use(cookieParser());//setting up/using the cookie parser

app.use(express.static('./assets'));//telling where static files are

app.use(expressLayouts); //using expressLayouts before routes because routes renders the view and we need to tell view that there are layouts also

//extract style and scripts from sub(individual) pages into the layout 
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//use express router 
app.use('/',require('./routes')); //it will by deafault fetch index in routes;


//set up the view engine
app.set('view engine', 'ejs'); //view engine is ejs
app.set('views', './views');

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});