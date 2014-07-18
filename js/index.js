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

global.App = _.extend({}, Backbone.Events);
// alow for "app" declarative event bindings
React.events.handle('app', {
  target: global.App
});

// set a global timeout for all ajax activity
Backbone.async.on('async', function(eventName, model, events, options) {
  options.timeout = 3000;
});

// initialze the Backbone router
var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'home': 'home',
    'create': 'create',

    'project/:repo/:project': 'showProject',
    'project/:repo/:project/overview': 'showProjectOverview',
    'project/:repo/:project/section/:section': 'showProjectSection',
    'project/:repo/:project/package/:package': 'showProjectPackage',
    'project/:repo/:project/method/:method': 'showProjectMethod',

    'project/:repo/:project/bundle/:childRepo/:childProject': 'showBundleProject',
    'project/:repo/:project/bundle/:childRepo/:childProject/overview': 'showBundleProjectOverview',
    'project/:repo/:project/bundle/:childRepo/:childProject/section/:section': 'showBundleProjectSection',
    'project/:repo/:project/bundle/:childRepo/:childProject/package/:package': 'showBundleProjectPackage',
    'project/:repo/:project/bundle/:childRepo/:childProject/method/:method': 'showBundleProjectMethod'
  },

  // show the home page
  home: function() {
    this.showProject('jhudson8', 'fancydocs');
  },

  create: function() {
    showView(new CreateView());
  },

  showBundleProject: function(org, repo, childOrg, childRepo) {
    this.withBundle(org, repo, childOrg, childRepo, function(project) {
      this._showProject(project, {top: true}, 'default');
    });
  },

  showBundleProjectOverview: function(org, repo, childOrg, childRepo) {
    this.withBundle(org, repo, childOrg, childRepo, function(project) {
      this._showProject(project, {overview: true});
    });
  },

  showBundleProjectSection: function(org, repo, childOrg, childRepo, section) {
    this.withBundle(org, repo, childOrg, childRepo, function(project) {
      this._showProject(project, {section: section});
    });
  },

  showBundleProjectPackage: function(org, repo, childOrg, childRepo, package) {
    this.withBundle(org, repo, childOrg, childRepo, function(project) {
      this._showProject(project, {package: package});
    });
  },

  showBundleProjectMethod: function(org, repo, childOrg, childRepo, method) {
    this.withBundle(org, repo, childOrg, childRepo, function(project) {
      this._showProject(project, {method: method});
    });
  },


  showProjectOverview: function(org, repo) {
    this.withProject(org, repo, function(project) {
      this._showProject(project, {overview: true});
    });
  },

  showProjectSection: function(org, repo, section) {
    this.withProject(org, repo, function(project) {
      this._showProject(project, {section: section});
    });
  },

  showProjectPackage: function(org, repo, package) {
    this.withProject(org, repo, function(project) {
      this._showProject(project, {package: package});
    });
  },

  showProjectMethod: function(org, repo, method) {
    this.withProject(org, repo, function(project) {
      this._showProject(project, {method: method});
    });
  },

  showProject: function(org, repo) {
    this.withProject(org, repo, function(project) {
      this._showProject(project, {top: true}, 'default');
    });
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
    showView(view);
  },

  withProject: function(org, repo, callback) {
    var self = this;
    projectManager.get(org, repo, function(project) {
      if (project) {
        callback.call(self, project);
      } else {
        self.projectNotFound(org, repo);
      }
    });
  },

  withBundle: function(org, repo, childOrg, childRepo, callback) {
    var self = this;
    projectManager.get(org, repo, function(project) {
      if (project && project.bundledProjects) {
        var id = childOrg + '/' + childRepo;
        var childProject = project.bundledProjects.get(id);
        if (childProject) {
          callback.call(self, childProject);
        } else {
          self.projectNotFound(org, repo);
        }
      }
    });
  },

  projectNotFound: function(org, repo) {
    showView(new ProjectNotFoundView({org: org, repo: repo}));
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