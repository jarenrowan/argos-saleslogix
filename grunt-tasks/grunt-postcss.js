module.exports = function gruntLess(grunt) {
  grunt.loadNpmTasks('grunt-postcss');

  grunt.config('postcss', {
    // Less is to allow backwards compatibility with previous stylesheets
    less: {
      options: {
        // map: true,
        parser: require('postcss-less-engine').parser,
        processors: [
          require('postcss-less-engine')({ compress: true }),
        ],
      },
      files: {
        'content/css/less.min.css': 'content/css/app.less',
      },
    },
    development: {
      options: {
        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('postcss-import')(), // allow importing css
          require('postcss-cssnext')({ browsers: 'last 2 versions' }),
        ],
      },
      files: {
        'dist/css/*.css': 'content/css/*.css',
      },
      // dist: {
      //   'content/css': 'dist/css/*.css',
      // },
    },
    production: {
      options: {
        // map: true,
        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('postcss-import')(), // allow importing css
          require('postcss-cssnext')({ browsers: 'last 2 versions' }),
          require('cssnano')(), // minify the result
        ],
      },
      files: {
        'min/css/app.min.css': 'content/css/all.css',
      },
      // dist: {
      //   'content/css': 'dist/css/*.css',
      // },
    },
  });
};
