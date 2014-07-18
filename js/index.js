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
var HomeView = require('./views/home-view');
var ProjectView = require('./views/project-view');

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
    var p = App.utils.getParameter('p');
    if (App.project) {
      showProject(App.project.get('repo'), App.project.get('name'));
    } else {
      showView(new HomeView());
    }
  },

  showBundleProject: function(repo, name, childRepo, childName) {
    this.withBundle(repo, name, childRepo, childName, function(project) {
      this._showProject(project, {top: true}, 'default');
    });
  },

  showBundleProjectOverview: function(repo, name, childRepo, childName) {
    this.withBundle(repo, name, childRepo, childName, function(project) {
      this._showProject(project, {overview: true});
    });
  },

  showBundleProjectSection: function(repo, name, childRepo, childName, section) {
    this.withBundle(repo, name, childRepo, childName, function(project) {
      this._showProject(project, {section: section});
    });
  },

  showBundleProjectPackage: function(repo, name, childRepo, childName, package) {
    this.withBundle(repo, name, childRepo, childName, function(project) {
      this._showProject(project, {package: package});
    });
  },

  showBundleProjectMethod: function(repo, name, childRepo, childName, method) {
    this.withBundle(repo, name, childRepo, childName, function(project) {
      this._showProject(project, {method: method});
    });
  },


  showProjectOverview: function(repo, name) {
    this.withProject(repo, name, function(project) {
      this._showProject(project, {overview: true});
    });
  },

  showProjectSection: function(repo, name, section) {
    this.withProject(repo, name, function(project) {
      this._showProject(project, {section: section});
    });
  },

  showProjectPackage: function(repo, name, package) {
    this.withProject(repo, name, function(project) {
      this._showProject(project, {package: package});
    });
  },

  showProjectMethod: function(repo, name, method) {
    this.withProject(repo, name, function(project) {
      this._showProject(project, {method: method});
    });
  },

  showProject: function(repo, name) {
    this.withProject(repo, name, function(project) {
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

  withProject: function(repo, name, callback) {
    var self = this;
    projectManager.get(repo, name, function(project) {
      if (project) {
        callback.call(self, project);
      }
    });
  },

  withBundle: function(repo, name, childRepo, childName, callback) {
    var self = this;
    projectManager.get(repo, name, function(project) {
      if (project && project.bundledProjects) {
        var id = childRepo + '/' + childName;
        var childProject = project.bundledProjects.get(id);
        if (childProject) {
          callback.call(self, childProject);
        }
      }
    });
  },
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
