 var gulp = require('gulp'),
        gwm = require('gulp-web-modules'),
        gwmLib = require('gwm-lib'),
        gwmIf = require('gwm-if'),
        uglify = require('gwm-uglify');

gwm({
  browserify: {
    transform: ['reactify']
  },

  plugins: [
    gwmLib({
      base: [
        {dev: 'underscore.js', prod: 'underscore.min.js'},
        {dev: 'bower:jquery', prod: 'bower:jquery/dist/jquery.min.js'},
        {dev: 'backbone.js', prod: 'backbone.min.js'},
        {dev: 'backbone.queryparams.js', prod: 'backbone.queryparams.min.js'},
        'backbone.queryparams-1.1-shim.js',
        {dev: 'semantic.js', prod: 'semantic.min.js'},
        {dev: 'react.js', prod: 'react.min.js'},
        {dev: 'script.js', prod: 'script.min.js'},
        {dev: 'backbone-reaction.js', prod: 'backbone-reaction.min.js'}
      ]
    }),
    gwmIf(uglify(), 'prod')
  ]
}).injectTasks(gulp);
