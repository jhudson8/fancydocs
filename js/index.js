/** @jsx React.DOM */

/**
 * Main entry point of the application.  This is where we set up the Backbone router and
 * do some global init and bindings
 */
React.mixins.add('state', {
  getInitialState: function(){
    return {};
  }
});

var projectManager = require('./utils/project-manager');
var SideNav = require('./views/nav/side-nav');
var ProjectView = require('./views/project-view');
var CreateView = require('./views/create-fancydoc-view');
var ProjectNotFoundView = require('./views/project-not-found');
var lastProject;

global.App = _.extend({}, Backbone.Events);
// alow for "app" declarative event bindings
React.events.handle('app', {
  target: global.App
});

// set a global timeout for all ajax activity
Backbone.async.on('async', function(eventName, model, events, options) {
  options.timeout = 3000;
});


// use the meta route definitions and handlers to DRY things up because therw will be multiple variations of routes
// that follow the same general pattern
var projectRoutes = {
  '': function(project) {
    return function() {
      this._showProject(project, {top: true}, 'default');
    };
  },
  'overview': function(project) {
    return function() {
      this._showProject(project, {overview: true});
    };
  },
  'section/:section': function(project) {
    return function(section) {
      this._showProject(project, {section: section});
    };
  },
  'api/:api': function(project) {
    return function(api) {
      this._showProject(project, {'api': api});
    };
  },
  'package/:package': function(project) {
    return function(pkg) {
      this._showProject(project, {'package': pkg});
    };
  },
  'method/:method': function(project) {
    return function(method) {
      this._showProject(project, {'method': method});
    };
  }
};

projectRoutes = _.map(projectRoutes, function(func, route) {
  var rtn = {};
  var routeSuffix = route && '/' + route || '';

  rtn['project/:repo/:project' + routeSuffix] = function(org, repo) {
    var self = this;
    var rootArgs = _.toArray(arguments);
    this._withProject(org, repo, function(project) {
      func(project).apply(self, rootArgs.slice(2));
    });
  };

  rtn['project/:repo/:project/bundle/:childRepo/:childProject' + routeSuffix] = function(org, repo, childOrg, childRepo) {
    var self = this;
    var rootArgs = _.toArray(arguments);
    this._withBundle(org, repo, childOrg, childRepo, function(project) {
      func(project).apply(self, rootArgs.slice(4));
    });
  };

  return rtn;
});
projectRoutes.splice(0, 0, {});
projectRoutes = _.extend.apply(_, projectRoutes);


// initialze the Backbone router
var Router = Backbone.Router.extend({
  routes: _.defaults({
    '': 'home',
    'home': 'home',
    'create': 'create',
    'link/:url': 'link'
  }, projectRoutes),

  // show the home page
  home: function() {
    this._withProject('jhudson8', 'fancydocs', function(project) {
      this._showProject(project);
    });
  },

  link: function(url) {
    // see if the url is a project reference for any known projects
    if (lastProject) {
      var project = lastProject.urlMatch(url);
      if (project) {
        return Backbone.history.navigate(project.viewUrl(true), {trigger: true, replace: true});
      }
    }
    window.location.href = url;
  },

  create: function() {
    showView(new CreateView());
  },

  _showProject: function(project, hilight, focus) {
    if (focus === 'default') {
      focus = project.getDefaultFocus();
    }
    project.set({
      hilight: hilight || {},
      focus: focus || hilight && project.get('focus') || project.getDefaultFocus()
    });
    var view = new ProjectView({
      model: project
    });
    lastProject = project;
    showView(view);
  },

  _withProject: function(org, repo, callback) {
    var self = this;
    projectManager.get(org, repo, function(project) {
      if (project) {
        callback.call(self, project);
      } else {
        self._projectNotFound(org, repo);
      }
    });
  },

  _withBundle: function(org, repo, childOrg, childRepo, callback) {
    var self = this;
    projectManager.get(org, repo, function(project) {
      if (project && project.bundledProjects) {
        var id = childOrg + '/' + childRepo;
        var childProject = project.bundledProjects.get(id);
        if (childProject) {
          callback.call(self, childProject);
        } else {
          self._projectNotFound(org, repo);
        }
      } else {
        self._projectNotFound(org, repo);
      }
    });
  },

  _projectNotFound: function(org, repo) {
    if (org === 'tmp') {
      Backbone.history.navigate('create', {replace: true, trigger: true});
    } else {
      showView(new ProjectNotFoundView({org: org, repo: repo}));
    }
  }
});

// utility method to show a view as the main page
function showView(view) {
  var el = document.getElementById('page-container');
  React.unmountComponentAtNode(el);
  React.renderComponent(view, el);
}

// initialize when the document is ready
$(document).ready(function() {
  new Router();
  Backbone.history.start();

  // when the search term is entered, kick off the search routing
  $('#search-form').on('submit', function(event) {
    event.preventDefault();
    var term = $('#search-input').val();
    if (term) {
      Backbone.history.navigate('/search/' + escape(term), true);
    }
  });
});

// utility function
App.utils = {
  collectify: function(data, collection, parent, project) {
    project = project || parent.project;
    var Model = collection.model || Backbone.Model;
    var models = _.map(data, function(value, name) {
      var data = _.defaults({
        name: name
      }, value);
      var model = new Model();
      model.parent = parent;
      model.project = project;
      model.set(model.parse(data));
      return model;
    });
    collection.reset(models);
    collection.project = project;
  },

  getParameter: function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
};


if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}