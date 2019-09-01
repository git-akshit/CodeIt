const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app); //passing app instance to view helpers
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');//to encrypt the session id(user_id)
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo')(session);//passing session as argument because it will store the cookies from this session
const sassMiddleware = require('node-sass-middleware');//it converts sass/scss code to css so that browser can understand it
const flash = require('connect-flash');//acquiring connect-flash
const customMware = require('./config/middleware');//acquiring middleware

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app); //requiring Server with app
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer); // requiring chat sockets
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path');

//using sass before server so that it changes sass files to css that is complies css files
if (env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'), //source of files
        dest: path.join(__dirname, env.asset_path, 'css'), //where to put the css files
        debug:true, //show debug message
        outputStyle: 'extended', //show error in multiple lines
        prefix: '/css' // /css is prefix 
    }));
}


app.use(express.urlencoded());//reading from the post requests
//cookies are read from middleware
app.use(cookieParser());//setting up/using the cookie parser

app.use(express.static(env.asset_path));//telling where static files are

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options)); // using morgan to write in files

app.use(expressLayouts); //using expressLayouts before routes because routes renders the view and we need to tell view that there are layouts also

//extract style and scripts from sub(individual) pages into the layout 
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//set up the view engine
app.set('view engine', 'ejs'); //view engine is ejs
app.set('views', './views');

//mongo store is used to store the session cookie in the db, so that user should re sign in if the server is restarted
app.use(session({//using express-session' in middleware to encrypt the cookie
    name: 'codeial',// name of the session cookie
    //TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,//there is a request which is not initialised, a session which has not initialised, a user which has not logged in,the identity is not established in that case do i need to store extra data in the session cookie? false means no
    resave: false, //when the identity is established then some sort of data is present in session cookie which is session data which user data do i need to rewrite it even if it has not changed?do i go and write the same thing again, i dont want to write same thing again abd again thats why it is false
    cookie: {
        maxAge: (1000 * 60 * 100) // session will expire after this much time
    },
    store: new MongoStore({ // creating instance of mongo Store
        mongooseConnection: db,  //connecting with mongoose
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup ok');
    }
    )
}));

app.use(passport.initialize());
app.use(passport.session()); // passport also helps in mainting the session

app.use(passport.setAuthenticatedUser);// whenever app is initialised then passport is also initialised, the user is stored in locals and can be used by the views,it checks whether session cookie is being mainted or not then this function is automatically called in middleware

app.use(flash()); //it uses session cookies so thats why it is being used after session
app.use(customMware.setFlash);//using flash

//use express router, use routes after initialising  
app.use('/',require('./routes')); //it will by deafault fetch index in routes;


app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});