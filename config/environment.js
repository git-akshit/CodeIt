const fs = require('fs'); //need to write in file stream
const rfs = require('rotating-file-stream');// it will be changing files
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');// it defines where the log will be stored
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory); //if log directory is not created and it will be created

const accessLogStream = rfs('access.log', { //when user access the site
    interval: '1d', //for 1 day
    path: logDirectory
})

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587, //using this port because it has highest security
        secure: false,
        auth: {
            user: 'practice.test123400',
            pass: 'codeialTest'
        }
    },
    google_client_id: "900174469843-tv02tpk856ja4s60drrgck9tk24mvg4f.apps.googleusercontent.com",
    google_client_secret: "8_8RsUZ06C8lWbQsD-G-S2JV",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587, //using this port because it has highest security
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);