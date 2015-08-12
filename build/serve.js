var gulp = require('gulp');
var serve = require('browser-sync');

gulp.task('serve', function(){
  serve({
    port: process.env.PORT || 3000,
    open: false,
    server: {
      baseDir: './dist'
    }
  });
});
