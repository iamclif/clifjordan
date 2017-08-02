'use strict';

var request = require('request');

module.exports = function (grunt) {
  debugger;
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'bin/www'
      }
    },
    sass: {
      dist: {
        files: {
          'public/styles/styles.css': 'public/styles/styles.scss'
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          'public/js/scripts.js': 'public/js/pre-babel-script.js'
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'bin/www',
          'app.js',
          'views/*.nunjucks',
          'routes/*.js',
          'routes/**/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['public/js/scripts.js'],
        options: {
          livereload: reloadPort
        }
      },
      scripts: {
        files: 'public/js/*.js',
        tasks: 'babel'
      },
      css: {
        files: [
          'public/**/*.scss'
        ],
        tasks: ['sass'],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: ['views/*.nunjucks','views/**/*.nunjucks'],
        options: {
          livereload: reloadPort
        }
      }
    },
    autoprefixer:{
      dist:{
        files: {
          'public/styles/styles.css':'public/styles/styles.css'
        },
        options: {
            map: true
        }
      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', [
    'sass',
    'autoprefixer',
    'develop',
    'babel',
    'watch'
  ]);
};
