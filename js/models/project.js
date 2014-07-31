var MethodCollection = require('./method-collection');
var PackageCollection = require('./package-collection');
var SectionCollection = require('./section-collection');
var Method = require('./method');
var Package = require('./package');
var util = require('../utils/util');

module.exports = Backbone.Model.extend({
  initialize: function(options) {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this._initCollections();
    this.project = this;
  },

  parse: function(data) {
    this._initCollections();
    data.baseUrl = '#project/' + data.id;
    var match = data.id.match(/^([^\/]*)\/?(.*)/);
    data.repo = match[1];
    data.name = match[2];

    var api = this.api = {};
    _.each(data.api, function(data, name) {
      var pkgCollection = new PackageCollection();
      util.collectify(data.packages, pkgCollection, pkgCollection, this);
      pkgCollection.each(function(pkg) {
        pkg.set('api', name);
      });
      pkgCollection.overview = data.overview;
      pkgCollection.name = name;
      pkgCollection.parent = this;
      api[name] = pkgCollection;
      pkgCollection.description = data.description;
    }, this);
    delete data.packages;

    util.collectify(data.sections, this.sections, this, this);
    delete data.sections;

    this.findAllMethodsAndPackages();
    return data;
  },

  findAllMethodsAndPackages: function(bundledProjects) {
    var allMethods = [];
    var allPackages = [];

    function find(project, bundleParent) {
      _.each(project.api, function(api) {
        var models = api.models;

        if (bundleParent) {
          models = api.models.map(function(model) {
            var _model = new Package();
            _.extend(_model, model);
            _model.bundleParent = bundleParent;
            return _model;
          });
        }
        allPackages.push.apply(allPackages, models);

        api.each(function(pkg) {
          var methods = pkg.methods.models;

          if (bundleParent) {
            methods = methods.map(function(model) {
              var _model = new Method();
              _.extend(_model, model);
              _model.bundleParent = bundleParent;
              return _model;
            });
          }

          allMethods.push.apply(allMethods, methods);
        });
      });
    }

    // this project
    find(this);

    // all projects
    if (bundledProjects) {
      _.each(bundledProjects, function(project) {
        find(project, this);
      }, this);
    }

    this.methods.reset(allMethods);
    this.packages.reset(allPackages);
  },

  onBundlesLoaded: function(bundledProjects) {
    this.findAllMethodsAndPackages(bundledProjects);
  },

  getDefaultFocus: function() {
    if (this.bundledProjects) {
      return 'projects';
    } else {
      return 'outline';
    }
  },

  _initCollections: function() {
    this.methods = this.methods || new MethodCollection();
    this.packages = this.packages || new PackageCollection();
    this.sections = this.sections || new SectionCollection();
  },

  getAllBundledProjects: function() {
    if (this.bundledProjects) {
      return {
        parent: this,
        bundledProjects: this.bundledProjects
      };
    } else if (this.parent) {
      return {
        parent: this.parent,
        bundledProjects: this.parent.bundledProjects
      };
    }
  },

  viewUrl: function(removeHash) {
    if (this.collection && this.parent) {
      return this.parent.viewUrl(removeHash) + '/bundle/' + this.id;
    }
    return (removeHash ? '' : '#' ) + 'project/' + this.id;
  },

  // if the url matches a known project, return that project
  urlMatch: function(url) {
    var match = url.match(/[\/\.]github\.io\/([^\/]*)\/(.*)/);
    if (!match) {
      match = url.match(/[\/\.]github\.com\/([^\/]*)\/(.*)/);
    }

    if (match) {
      var org = match[1], repo = match[2];
      var projects = this.getAllBundledProjects() || {parent: lastProject, bundledProjects: new Backbone.Collection()};
      function projectMatch(project) {
        return (project.get('repo') === org && project.get('name') === repo);
      }
      if (projectMatch(projects.parent)) return parent;
      for (var i=0; i<projects.bundledProjects.models.length; i++) {
        if (projectMatch(projects.bundledProjects.models[i])) return projects.bundledProjects.models[i];
      }
    }
  },

  hasChildren: function() {
    return this.bundledProjects && this.bundledProjects.length > 0;
  },

  findMethod: function(packageName, methodName) {
    var pkg = this.findPackage(packageName);
    if (pkg) {
      return pkg.methods.findWhere({name: methodName});
    }
  },

  findPackage: function(packageName) {
    return this.packages.findWhere({name: packageName});
  },

  findSection: function(parts) {
    var parent = this;
    while (parts.length > 0 && parent) {
      parent = parent.sections.findWhere({title: parts.splice(0, 1)[0]});
    }
    return parent;
  },

  isEqual: function(model) {
    return model.id === this.id;
  }
});
