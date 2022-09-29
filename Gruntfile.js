/* jshint camelcase: false */
'use strict';

module.exports = function (grunt) {
  var serverConfig = require('./server/config');

  // Array of page script file names. These should map to a page-{foo}.js file.
  var PAGES = [
    'home',
    'detail',
    'category',
    'search',
    'my-account',
    'my-packages',
    'my-favorites',
    'subscribe',
    'unsubscribe',
    'packages',
    'login',
    'register',
    'recoverpassword',
    'resetpassword',
    'upload',
    'static',
    'error',
    'share',
    'vpop',
  ];

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    config: {
      src: 'src',
      dist: 'dist',
      server: 'server',
      templates: 'templates',
      tmp: '.tmp',
    },

    /**
     * Watch for changes and automatically kick-off other tasks. At the moment
     * this is only relevant for sass files.
     */
    watch: {
      livereload: {
        options: {
          livereload: serverConfig.livereload_port,
        },
        files: ['<%= config.tmp %>/styles/*'],
      },
      styles: {
        files: [
          '<%= config.src %>/{styles,components}/**/*.scss',
          '<%= config.templates %>/*/{styles,components}/**/*.scss',
        ],
        tasks: ['sass:dev'],
      },
      server: {
        files: ['<%= config.server %>/**/*.js'],
        tasks: ['express'],
        options: {
          spawn: false,
        },
      },
    },

    /**
     * Start the server in development mode
     */
    express: {
      dev: {
        options: {
          script: 'server/server.js',
        },
      },
    },

    /**
     * Clear out dist and tmp directories
     */
    clean: {
      dev: '<%= config.tmp %>',
      dist: ['<%= config.tmp %>', '<%= config.dist %>'],
      cleanup: [
        '<%= config.dist %>/components/**/*.{js,scss,css}',
        '<%= config.dist %>/scripts/{core,src,components}',
      ],
    },

    /**
     * Delete empty directories after a release build
     */
    cleanempty: {
      options: {
        files: false,
      },
      dist: {
        src: ['<%= config.dist %>/components/**/* '],
      },
    },

    /**
     * Copy files that are not handled by other tasks
     */
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= config.src %>',
            dest: '<%= config.dist %>',
            src: [
              '*.{ico,png,html}',
              '.htaccess',
              'styles/fonts/**/*',
              'components/**/*',
            ],
          },
          {
            expand: true,
            cwd: '<%= config.src %>/templates/',
            dest: '<%= config.dist %>/templates',
            src: ['**/*.hbs'],
          },
        ],
      },
      robots: {
        files: [
          {
            cwd: '<%= config.src %>',
            src: 'robots.txt',
            dest: '<%= config.dist %>',
            expand: true,
          },
        ],
      },
      ebenv: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '.ebenv/<%= grunt.option("target") %>',
            dest: '.ebextensions',
            src: ['*.config'],
          },
        ],
      },
      tmp: {
        files: [
          {
            expand: true,
            cwd: '<%= config.tmp %>/scripts',
            dest: '<%= config.dist %>/scripts',
            src: ['**/*.js'],
          },
        ],
      },
    },

    /**
     * Compile sass to css. Sourcemaps will be generated in dev mode, and
     * files will be compressed in prod mode.
     */
    sass: {
      options: {
        precision: 10,
        loadPath: ['.'],
      },
      dev: {
        options: {
          sourceMap: true,
        },
        files: [
          {
            src: ['*.scss'],
            dest: '<%= config.tmp %>/styles',
            cwd: '<%= config.src %>/styles',
            expand: true,
            ext: '.css',
          },
        ],
      },
      dist: {
        options: {
          outputStyle: 'compressed',
        },
        files: [
          {
            src: ['*.scss'],
            dest: '<%= config.dist %>/styles',
            cwd: '<%= config.src %>/styles',
            expand: true,
            ext: '.css',
          },
        ],
      },
    },

    /**
     * Minify javascript files not handled by require.js.
     */
    uglify: {
      options: {
        preserveComments: 'some',
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= config.tmp %>/scripts',
            src: ['*.js'],
            dest: '<%= config.dist %>/scripts',
          },
        ],
      },
    },

    /**
     * Copy images to dist and optimize them.
     */
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= config.dist %>/components',
            src: ['**/*.{png,jpg,jpeg}'],
            dest: '<%= config.dist %>/components',
          },
        ],
      },
    },

    /**
     * Add the build time
     */
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'build_time',
              replacement: '<%= grunt.template.today() %>',
            },
          ],
        },
        files: [
          {
            expand: true,
            src: ['<%= config.dist %>/templates/**/*.hbs'],
          },
        ],
      },
    },

    /**
     * Automatically open a browser window
     */
    open: {
      dev: {
        path: 'http://localhost:' + serverConfig.port,
      },
    },

    /**
     * Ensure code quality/consistency
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      all: [
        'Gruntfile.js',
        '<%= config.src %>/scripts/**/*.js',
        '<%= config.server %>/**/*.js',
        '!<%= config.src %>/scripts/libs/**',
      ],
    },

    /**
     * Configure a post-commit hook to run jshint
     */
    githooks: {
      all: {
        'pre-commit': 'jshint',
      },
    },

    /**
     * Hack around this issue:
     * https://github.com/jmreidy/grunt-browserify/issues/350
     */
    wait: {
      forBrowserifyToFinish: {
        options: {
          delay: 250,
        },
      },
    },

    /**
     * Browserify to allow node-style require() calls on the front-end.
     * seems paths not used.
     * npm i ./brightcove_modules/bccsticky
     */
    browserify: {
      options: {
        paths: ['./node_modules', './brightcove_modulesx'],
        browserifyOptions: {
          debug: true,
          paths: ['./node_modules', './brightcove_modulesx'],
        },
      },
      all: {
        src: PAGES.map(function (page) {
          return '<%= config.src %>/scripts/page-' + page + '.js';
        }),
        dest: '<%= config.tmp %>/scripts/common.js',
        options: {
          paths: ['./node_modules', './brightcove_modulesx'],
          browserifyOptions: {
            debug: true,
            paths: ['./brightcove_modulesx'],
          },
          transform: ['stringify'],
          watch: true,
          alias: {
            app: './src/scripts/app.js',
          },
          plugin: [
            [
              'factor-bundle',
              {
                outputs: PAGES.map(function (page) {
                  return '<%= config.tmp %>/scripts/page-' + page + '.js';
                }),
              },
            ],
            [
              'remapify',
              [
                {
                  cwd: '<%= config.src %>/components',
                  src: '**/*.js',
                  expose: 'components',
                },
                {
                  cwd: '<%= config.src %>/scripts/libs',
                  src: '**/*.js',
                  expose: 'libs',
                },
                {
                  cwd: '<%= config.src %>/scripts/views',
                  src: '**/*.js',
                  expose: 'views',
                },
                {
                  cwd: './brightcove_modules/bccsticky',
                  src: 'dist/jquery.sticky.js',
                  expose: 'bccsticky',
                },
              ],
            ],
          ],
        },
      },
    },
  });

  grunt.registerTask('postinstall', function () {
    grunt.loadNpmTasks('grunt-githooks');
    grunt.task.run('githooks');
  });

  grunt.registerTask('server', function () {
    grunt.task.run([
      'clean:dev',
      'sass:dev',
      'browserify',
      'express:dev',
      'open',
      'watch',
    ]);
  });

  grunt.registerTask('release', function () {
    let rtasks0 = ['jshint', 'clean:dist'];
    let rtasks1 = [
      'copy:dist',
      'copy:ebenv',
      'sass:dist',
      'imagemin',
      'browserify',
      'wait',
      'uglify',
      'replace',
      'clean:cleanup',
      'cleanempty',
    ];
    let rtasks = rtasks0;
    if (grunt.option('target') !== 'production') rtasks.push('copy:robots');
    rtasks = rtasks.concat(rtasks1);
    grunt.task.run(rtasks);
  });
};
