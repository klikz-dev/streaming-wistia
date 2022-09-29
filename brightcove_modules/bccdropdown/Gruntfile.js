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
        files: {
          'dist/dropdown.js': [
            'src/dropdown.js'
          ]
        }
      }
    },
    uglify: {
      all: {
        files: {
          'dist/dropdown.min.js': [
            'src/dropdown.js'
          ]
        }
      }
    },

    sass: {
      all: {
        options: {
          sourcemap: 'none'
        },
        files: {
          'dist/bcc-dropdown.css': [
            'src/dropdown.scss'
          ]
        }
      }
    },

    jshint: {
      all: {
        files: [{
          src: ['Gruntfile.js']
        }, {
          src: ['**/*.js'],
          expand: true,
          cwd: 'src'
        }]
      },
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js'],
        tasks: ['jshint']
      },
      styles: {
        files: ['src/**/*.scss'],
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'jshint',
    'sass'
  ]);

  grunt.registerTask('release', [
    'jshint',
    'clean',
    'copy',
    'sass',
    'uglify'
  ]);
};
