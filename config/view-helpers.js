const env = require('./environment');
const fs = require('fs'); //it will read the file which is there
const path = require('path');

//helper function to load the files in the view, it load the corresponding file acccording to its key in manifest, it will be avialable in views after calling in index
module.exports = (app) => { // it will get the express app instance
    app.locals.assetPath = function(filePath){ // making it available globally in app through locals
        if (env.name == 'development'){
            return filePath;
        }

        return '/' +  JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath]; // accesing the key in manifest
    } // adding / above because rev-manifest dosent has a / in key value pair
}