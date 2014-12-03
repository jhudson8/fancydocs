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
    return function(args) {
      args.jumpTo = 'top';
      this._showProject(project, args);
    };
  },
  'summary': function(project) {
    return function(args) {
      args.jumpTo = 'summary';
      this._showProject(project, args);
    };
  },
  'installation': function(project) {
    return function(args) {
      args.jumpTo = 'installation';
      this._showProject(project, args);
    };
  },
  'section/*section': function(project) {
    return function(args) {
      var section = project.findSection(args.section.split('/'));
      if (section) {
        args.jumpTo = section.domId();
      }
      this._showProject(project, args);
    };
  },
  'api/:api': function(project) {
    return function(args) {
      var api = project.api[args.api];
      if (api) {
        args.jumpTo = api.domId();
      }
      this._showProject(project, args);
    };
  },
  'package/:package': function(project) {
    return function(args) {
      var pkg = project.findPackage(args.package);
      if (pkg) {
        args.jumpTo = pkg.domId();
      }
      this._showProject(project, args);
    };
  },
  'method/:package/:method': function(project) {
    return function(args) {
      var method = project.findMethod(args.package, args.method);
      if (method) {
        args.jumpTo = method.domId();
      }
      this._showProject(project, args);
    };
  },
  'snippet/package/:package': function(project) {
    return function(args) {
      var pkg = project.findPackage(args.package);
      args.snippet = {
        type: 'package',
        model: pkg
      };
      this._showProject(project, args);
    };
  },
  'snippet/method/:package/:method': function(project) {
    return function(args) {
      var method = project.findMethod(args.package, args.method);
      args.snippet = {
        type: 'method',
        model: method
      };
      this._showProject(project, args);
    };    
  },
  'snippet/api/:api': function(project) {
    return function(args) {
      var api = project.api[args.api];
      args.snippet = {
        type: 'api',
        model: api
      };
      this._showProject(project, args);
    };    
  },
  'snippet/summary': function(project) {
    return function(args) {
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

  rtn['project/:org/:repo' + routeSuffix] = function(args) {
    var self = this;
    this._withProject(args.org, args.repo, function(project) {
      func(project).call(self, args);
    });
  };

  rtn['project/:org/:repo/bundle/:childOrg/:childRepo' + routeSuffix] = function(args) {
    var self = this;
    this._withBundle(args.org, args.repo, args.childOrg, args.childRepo, function(project) {
      func(project).call(self, args);
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
        return Backbone.history.navigate(project.viewUrl(true), {trigger: true, replace: true});
      }
    }
    window.location.href = url;
  },

  create: function() {
    showView(new CreateView());
  },

  _showProject: function(project, viewState) {
    viewState = new ViewState(viewState, project);
    var view = new ProjectView({
      model: project,
      viewState: viewState
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

var ViewState = function(params, project) {
  _.extend(this, params);
};
_.extend(ViewState.prototype, {
  updateFocus: function(focus) {
    this.focus = focus;
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
  },

  toUrl: function(url, focus) {
    return url + '?focus=' + this.focus;
  }
});

module.exports = Router;