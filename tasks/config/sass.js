/**
 * `clean`
 *
 * ---------------------------------------------------------------
 *
 * Remove the files and folders in your Sails app's web root
 * (conventionally a hidden directory called `.tmp/public`).
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-clean
 *
 */

module.exports = function (grunt) {
  grunt.config.set('sass', {
    dev: {
      files: [{
        expand: true,
        cwd: '.tmp/public/styles/',
        src: ['**/*.scss'],
        dest: '.tmp/public/styles/',
        ext: '.css',
        extDot: 'last'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
};
