Backbone.Router.namedParameters = true;

var projectManager = require('./utils/project-manager');
var SideNav = require('./views/nav/side-nav');
var ProjectView = require('./views/project-view');
var CreateView = require('./views/create-fancydoc-view');
var ProjectNotFoundView = require('./views/project-not-found');
var util = require('./utils/util');
var lastProject;

$(document.body).on('click', 'a', function(ev) {
  var el = ev.currentTarget;
  var fragment = el.getAttribute('href');
  var match = fragment && fragment.match('#link\/(.*)');
  if (match) {
    fragment = decodeURIComponent(match[1]);
    var snippedSectionFrag = fragment.match(/^#?((section|snippet|)\/.*)/);
    if (snippedSectionFrag) {
      snippedSectionFrag = snippedSectionFrag[1];
      var currentFragment = Backbone.history.getFragment();
      // get the project path prefix
      var projectFrag = currentFragment && currentFragment.match(/^(project\/[^\/]+\/[^\/]+(\/bundle\/[^\/]+\/[^\/]+)?).*/);
      if (projectFrag) {
        Backbone.history.navigate(projectFrag[1] + '/' + snippedSectionFrag, true);
        ev.preventDefault();
      }
    }
  }
});

// use the meta route definitions and handlers to DRY things up because therw will be multiple variations of routes
// that follow the same general pattern
var projectRoutes = {
  '': function(project, args) {
    return function() {
      var args = {};
      args.jumpTo = 'top';
      this._showProject(project, args);
    };
  },
  'summary': function(project) {
    return function() {
      var args = {};
      args.jumpTo = 'summary';
      this._showProject(project, args);
    };
  },
  'installation': function(project) {
    return function() {
      var args = {};
      args.jumpTo = 'installation';
      this._showProject(project, args);
    };
  },
  'section/*section': function(project) {
    return function(_section) {
      var args = {
        section: _section
      };
      var section = project.findSection(_.map(args.section.split('/'), function(val) { return decodeURIComponent(val); }) );
      if (section) {
        args.jumpTo = section.domId();
      }
      this._showProject(project, args);
    };
  },
  'api/:api': function(project) {
    return function(_api) {
      var args = {
        api: _api
      };
      var api = project.api[_api];
      if (api) {
        args.jumpTo = api.domId();
      }
      this._showProject(project, args);
    };
  },
  'package/:package': function(project) {
    return function(_package) {
      var args = {
        package: _package
      };
      var pkg = project.findPackage(_package);
      if (pkg) {
        args.jumpTo = pkg.domId();
      }
      this._showProject(project, args);
    };
  },
  'method/:package/:method': function(project) {
    return function(_package, _method) {
      var args = {
        package: _package,
        method: _method
      };
      var method = project.findMethod(_package, _method);
      if (method) {
        args.jumpTo = method.domId();
      }
      this._showProject(project, args);
    };
  },
  'snippet/package/:package': function(project) {
    return function(_package) {
      var args = {
        package: _package
      };
      var pkg = project.findPackage(_package);
      args.snippet = {
        type: 'package',
        model: pkg
      };
      this._showProject(project, args);
    };
  },
  'snippet/method/:package/:method': function(project) {
    return function(_package, _method) {
      var args = {
        package: _package,
        method: _method
      };
      var method = project.findMethod(_package, _method);
      args.snippet = {
        type: 'method',
        model: method
      };
      this._showProject(project, args);
    };    
  },
  'snippet/api/:api': function(project) {
    return function(_api) {
      var args = {
        api: _api
      };
      var api = project.api[_api];
      args.snippet = {
        type: 'api',
        model: api
      };
      this._showProject(project, args);
    };    
  },
  'snippet/summary': function(project) {
    return function() {
      var args = {};
      args.snippet = {
        type: 'summary',
        model: project
      };
      this._showProject(project, args);
    };
  }
};

projectRoutes = _.map(projectRoutes, function(func, route) {
  var rtn = {};
  var routeSuffix = route && '/' + route || '';

  rtn['project/:org/:repo' + routeSuffix] = function(org, repo) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 2);
    this._withProject(org, repo, function(project) {
      func(project).apply(self, args);
    });
  };

  rtn['project/:org/:repo/bundle/:childOrg/:childRepo' + routeSuffix] = function(org, repo, childOrg, childRepo) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 2);
    this._withBundle(org, repo, childOrg, childRepo, function(project) {
      func(project).apply(self, args);
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
    url = url.url || url;
    // see if the url is a project reference for any known projects
    if (lastProject) {
      var project = lastProject.urlMatch(url);
      if (project) {
        return Backbone.history.navigate(project.viewUrl(true), { trigger: true, replace: true });
      }
    }
    window.location.href = url;
  },

  create: function() {
    showView(new CreateView());
  },

  _showProject: function(project, viewState) {
    viewState = new ViewState(viewState, project);
    var view = <ProjectView model={project} viewState={viewState}/>;
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
      Backbone.history.navigate('create', { replace: true, trigger: true });
    } else {
      showView(new ProjectNotFoundView({org: org, repo: repo}));
    }
  }
});

// utility method to show a view as the main page
function showView(view) {
  var el = document.getElementById('page-container');
  React.unmountComponentAtNode(el);
  React.render(view, el);
}

var ViewState = function(params, project) {
  _.extend(this, params);
  if (!this.focus) {
    this.focus = 'outline';
  }
};
_.extend(ViewState.prototype, {
  updateFocus: function(focus) {
    // we aren't persisting focus
    this.focus = focus;

/*
    var fragment = Backbone.history.getFragment();
    var focusPart = 'focus=' + (focus || '');
    var match = fragment.match('focus=');
    if (match) {
      fragment = fragment.replace(/focus=[a-zA-Z]+/, focusPart);
    } else if (fragment.indexOf('?') > 0) {
      fragment += focusPart;
    } else {
      fragment += ('?' + focusPart);
    }
    Backbone.history.navigate(fragment, {trigger: false, replace: true});
*/
  },

  toUrl: function(url, focus) {
    return url;
  }
});

module.exports = Router;