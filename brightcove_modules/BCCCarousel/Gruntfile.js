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
          { src: ['**'], dest: 'dist/images', cwd: 'src/images/', expand: true }
        ]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      all: {
        files: {
          // Since many of these modules override functions in other modules
          // to add/alter behavior, order matters.
          'dist/bcc-carousel.js': [
            'src/scripts/core.js',
            'src/scripts/pagination.js',
            'src/scripts/controls.js',
            'src/scripts/lazyloader.js',
            'src/scripts/autoscroll.js',
            'src/scripts/touchscrolling.js',
            'src/scripts/responsive.js'
          ]
        }
      }
    },
    uglify: {
      options: {
        banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %> */"
      },
      all: {
        files: {
          'dist/bcc-carousel.min.js': ['dist/bcc-carousel.js']
        }
      }
    },
    sass: {
      all: {
        files: {
          'dist/bcc-carousel.css': ['src/styles/carousel.scss']
        }
      }
    },
    jshint: {
      all: {
        files: [
          { src: ['Gruntfile.js'] },
          { src: ['**/*.js'], expand: true, cwd: 'src/' }
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
      },
      styles: {
        files: ['src/**/*.scss'],
        tasks: ['sass']
      }
    },
    mocha: {
      options: {
        run: true,
        reporter: 'Spec'
      },
      test: {
        src: ['test/**/*.html'],
        tasks: ['test/**/*.html']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('default', [
    'jshint',
    'sass',
    'copy'
  ]);

  grunt.registerTask('test', [
    'mocha'
  ]);

  grunt.registerTask('release', [
    'jshint',
    // 'test',
    'clean',
    'copy',
    'sass',
    'concat',
    'uglify'
  ]);
};
