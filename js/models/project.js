var MethodCollection = require('./method-collection');
var PackageCollection = require('./package-collection');
var SectionCollection = require('./section-collection');

module.exports = Backbone.Model.extend({
  initialize: function(options) {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this._initCollections();
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
      App.utils.collectify(data.packages, pkgCollection, pkgCollection, this);
      pkgCollection.overview = data.overview;
      pkgCollection.name = name;
      pkgCollection.parent = this;
      api[name] = pkgCollection;
      pkgCollection.description = data.description;
    }, this);
    delete data.packages;

    App.utils.collectify(data.sections, this.sections, this, this);
    delete data.sections;

    var allMethods = [];
    var allPackages = [];
    _.each(api, function(api) {
      allPackages.push.apply(allPackages, api.models);
      api.each(function(pkg) {
        allMethods.push.apply(allMethods, pkg.methods.models);
      });
    });
    this.methods.reset(allMethods);
    this.packages.reset(allPackages);

    // keeping a little view state in the models so the will persist for the user
    data.focus = this.getDefaultFocus();
    data.hilight = {};
    return data;
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
      return this.parent.viewUrl() + '/bundle/' + this.id;
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

  }
});
