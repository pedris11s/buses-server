/**
 * Compress CSS files.
 *
 * ---------------------------------------------------------------
 *
 * Minify the intermediate concatenated CSS stylesheet which was
 * prepared by the `concat` task at `.tmp/public/concat/production.css`.
 *
 * Together with the `concat` task, this is the final step that minifies
 * all CSS files from `assets/styles/` (and potentially your LESS importer
 * file from `assets/styles/importer.less`)
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-cssmin
 *
 */
module.exports = function (grunt) {
  grunt.config.set('cssmin', {
    dev: {
      files: [{
        src: ['.tmp/public/concat/production.css'],
        dest: '.tmp/public/min/production.min.css'
      }, {
        // Enable dynamic expansion.
        expand: true,

        // Src matches are relative to this path.
        cwd: '.tmp/',

        // Actual pattern(s) to match.
        src: ['**/*.css'],

        // Destination path prefix.
        dest: '.tmp/',

        // Dest filepaths will have this extension.
        ext: '.css',

        // Extensions in filenames begin after the first dot
        extDot: 'last'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
};
