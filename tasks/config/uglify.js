/**
 * `uglify`
 *
 * ---------------------------------------------------------------
 *
 * Minify client-side JavaScript files using UglifyJS.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-uglify
 *
 */
module.exports = function (grunt) {
  grunt.config.set('uglify', {
    dev: {
      files: [{
        // Enable dynamic expansion.
        expand: true,

        // Src matches are relative to this path.
        cwd: '.tmp/',

        // Actual pattern(s) to match.
        src: ['**/*.js'],

        // Destination path prefix.
        dest: '.tmp/',

        // Dest filepaths will have this extension.
        ext: '.js',

        // Extensions in filenames begin after the first dot
        extDot: 'last'
      }, {
        src: ['.tmp/public/concat/production.js'],
        dest: '.tmp/public/min/production.min.js'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};
