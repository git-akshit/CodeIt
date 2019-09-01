const gulp = require('gulp');

const sass = require('gulp-sass');//it converts sass to css for gulp
const cssnano = require('gulp-cssnano'); //it compresses css
const rev = require('gulp-rev'); // it will attach random string in front of css file, so that browser thinks it is a new one and has to load it
const uglify = require('gulp-uglify-es').default;  //npm install gulp-uglify-es for minifying js
const imagemin = require('gulp-imagemin'); //npm install gulp-imagemin for minifying images
const del = require('del'); //npm install del
var revManifest = require('gulp-revmanifest');
//everything in gulp is associated with tasks
gulp.task('css', function(done){
    console.log('minifying css..');
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass()) //pipe is used to run functions for gulp, calling scss function which converts sass to css
    .pipe(cssnano())//calling function to minimise css
    .pipe(gulp.dest('./assets.css'));

     gulp.src('./assets/**/*.css') //pickup the file from css
    .pipe(rev()) //calling rev to rename the file
    .pipe(gulp.dest('./public/assets')) // renamed it and created it
    .pipe(revManifest({ //creating manifest, manifest contains the original name of the file and renamed file
        cwd: 'public',
        merge: true //if a name already exists then it will not change it, it will merge it with already existing files
    }))
    .pipe(gulp.dest('./public/assets')); //put it in assets
    done();
});

//minifying js
gulp.task('js', function(done){
    console.log('minifying js...');
     gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(revManifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
});

//miniying images
gulp.task('images', function(done){
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(revManifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});


// empty the public/assets directory
gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
});

//creating a single function to run the above tasks
gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
});