/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      all: ['dist/']
    },
    copy: {
      all: {
        files: [
          { src: ['**'], dest: 'dist', cwd: 'src', expand: true }
        ]
      }
    },
    uglify: {
      options: {
        banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %> */"
      },
      all: {
        files: {
          'dist/jquery.sticky.min.js': [
            'dist/jquery.sticky.js'
          ]
        }
      }
    },
    jshint: {
      all: {
        files: [
          { src: ['Gruntfile.js'] },
          { src: ['**/*.js'], expand: true, cwd: 'src' }
        ]
      },
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js'],
        tasks: ['jshint']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [
    'jshint'
  ]);

  grunt.registerTask('release', [
    'jshint',
    'clean',
    'copy',
    'uglify'
  ]);
};
