var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var config = require('./gulp.config')();
var browserSync = require('browser-sync');
var del = require('del');
var reload = browserSync.reload;
var modRewrite = require('connect-modrewrite');    
var runSequence = require('run-sequence');
var minifyHTML = require('gulp-minify-html');


/**
 * Gulp Tasks
 */
 
 gulp.task('sass', function() {
    log('Compiling Sass --> CSS');

    var sassOptions = {
        outputStyle: 'nested' // nested, expanded, compact, compressed
    };

    return gulp
        .src(config.sass)
        .pipe($.plumber({errorHandler: swallowError}))
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.client + '/styles'));
});
 
 // inject from html file css and js file for minification
gulp.task('inject', function(){
  log('Injecting custom scripts and css from index.html');
  return gulp.src(config.client+'/*.html')
    .pipe($.useref())
    .pipe($.if('*.js', $.uglify({compress: {drop_console: true}})))
    .pipe($.if('*.css', $.cssnano()))
    .pipe(gulp.dest('dist'))
});


// copy images,fonts,views and js files
gulp.task('copy', function(){
  log('copy images,fonts,views and js files to dist')
  gulp.src(config.client+'/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe($.cache($.imagemin({interlaced: true})))
    .pipe(gulp.dest('dist/img'))
  gulp.src(config.client+'/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
  gulp.src(config.client+'/views/**/*')
    .pipe(gulp.dest('dist/views'))
    
  return gulp.src(config.client+'/js/**/**/**/**/*')
  .pipe(gulp.dest('dist/js'))
});

//minify css,html and js files
gulp.task('minify', function() {
  log('minify css,html and js files')
	var opts = {comments:true,spare:true};
  gulp.src('dist/views/**/**/**/**/*.js')
    .pipe($.uglify({compress: {drop_console: true}}))
    .pipe(gulp.dest('dist/views/'));
    
  gulp.src('dist/views/**/**/**/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('dist/views/'))
    
  gulp.src('dist/views/**/**/**/**/*.css')
    .pipe($.useref())
    .pipe($.if('*.css', $.cssnano()))
    .pipe(gulp.dest('dist/views/'))
    
  return gulp.src('dist/index.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('dist'))
    
});


gulp.task('browser-sync', function() {
  var options = {
        port: 8000,
        host: '*',
        logger: 'dev',
        ghostMode: {
            clicks: false,
            location: false,
            forms: false,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0, //1000,
        online: true
    };
    options.server = {
            baseDir: config,
            middleware: [
                       modRewrite(['!\.html|\.woff|\.woff2|\.eot|\.ttf|\.svg|\.js|\.jpg|\.mp4|\.mp3|\.gif|\.svg\|.css|\.png$ /index.html [L]'])
                ]
        };

  browserSync(options);
        
      
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return $.nodemon({
    script: 'server.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 100);
  });
});


gulp.task('watch', ['browser-sync'], function () {
  // watch all files
  gulp.watch([config.client+'/**/**/**.*'], reload);
  
  // watch scss files
  gulp.watch(config.sass,['sass']);
  
});

// delete dist
gulp.task('clean', function() {
  return del.sync('dist');
})

// clear cache
gulp.task('cache:clear', function () {
    return $.cache.clearAll()
})

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.green(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.green(msg));
    }
}


function swallowError (error) {
    // If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}



gulp.task('dev', function () {
    runSequence(
        'sass',
        'watch');
});

gulp.task('default', function () {
    gulp.run('dev');
});


gulp.task('prod', function(){
    runSequence(
        'clean',
        'cache:clear',
        ['inject','copy','minify'],
        'nodemon'
    );
});