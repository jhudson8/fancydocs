var Project = require('../models/project');
var ProjectCollection = require('../models/project-collection');
var projects = new ProjectCollection();
var nextId;
var lastImport;
var tmpOrganization;
var index = {};

var TEMP_PROJECT = '_tmp';

module.exports = {
  all: projects,

  get: function(repo, name, callback) {
    var id = repo + '/' + name;
    var project = projects.get(id);
    if (project) {
      return _.defer(function() {
        callback(project);
      });
    }

    var projectUrl = 'http://' + repo + '.github.io/' + name + '/fancydocs.js';
    if (repo === 'url') {
      projectUrl = name;
    }

    module.exports.import(id, projectUrl, function(project) {
      callback(project);
    });
  },

  register: function(data) {
    data.name = data.name || data.title;
    if (nextId === TEMP_PROJECT) {
      data.id = 'tmp/' + data.name;
      data.repo = tmpOrganization;
    } else {
      data.id = nextId;
    }
    nextId = undefined;
    var project = new Project();
    project.set(project.parse(data));
    projects.add(project);
    addToIndex(project);
    lastImport = project;

    App.trigger('registered', project);
  },

  viewTempProject: function(organization, data, callback) {
    nextId = TEMP_PROJECT;
    tmpOrganization = organization;
    eval(data);
    var project = lastImport;
    project.set('repo', organization);
    lastImport = undefined;
    nextId = undefined;
    module.exports.importProjectBundles(project, function() {
      Backbone.history.navigate('project/' + project.id, true);
    });
  },

  search: function(searchTerm) {

  },

  import: function(id, url, callback) {
    var match = id.match(/^([^\/]*)\/?(.*)$/),
        repo = match[1],
        name = match[2];
    nextId = id;
    $script(url, function() {
      var parentLastImport = lastImport;
      lastImport = undefined;
      if (!parentLastImport) {
        return callback();
      }

      module.exports.importProjectBundles(parentLastImport, callback);
    });
  },

  importProjectBundles: function(project, callback) {
    function complete() {
      callback(project);
    }

    var projects = _.clone(project.get('bundledProjects'));
    if (projects) {
      var childProjects = [];
      function loadFirstProject(childProject) {
        if (childProject) {
          childProject.parent = project;
          childProjects.push(childProject);
        }
        if (projects.length === 0) {
          project.bundledProjects = new ProjectCollection(childProjects, {parent: project});
          complete();
        } else {
          var projectInfo = projects.splice(0, 1)[0];
          var match = projectInfo.id.match(/([^\/]*)\/(.*)/);
          if (match) {
            module.exports.get(match[1], match[2], loadFirstProject);
          } else {
            module.exports.get(project.get('repo'), projectInfo.id, loadFirstProject);
          }
        }
      }
      loadFirstProject();
    } else {
      complete();
    }
  }
};

global.registerMixin = module.exports.register;
global.registerProject = module.exports.register;

function addToIndex(model) {
  var used = {};
  indexContent(model.get('overview'), {id: model.id, context: 'overview'}, index, used);
  indexContent(model.get('summary'), {id: model.id, context: 'summary'}, index, used);

  // FIXME fix indexing
  return;
  model.mixins.each(function(mixin) {
    used = {};
    var context = {id: model.id, context: 'mixin', mixin: mixin.get('name')};
    indexContent(mixin.get('summary'), context, index, used);
    indexContent(mixin.get('overview'), context, index, used);

    mixin.methods.each(function(method) {
      used = {};
      var context = {id: model.id, context: 'method', name: method.get('name'), mixin: mixin.get('name'), methodName: method.get('name')};
      indexContent(method.get('summary'), context, index, used);
      indexContent(method.get('overview'), context, index, used);

      _.each(mixin.parameters, function(desc, name) {
        indexContent(name, context, index, used);
        indexContent(desc, context, index, used);
      });
    });
  });
}

function indexContent(content, context, index, used) {
  if (!content) return;
  var parts = (content).split(/\s+/), part;
  for (var i=0; i<parts.length; i++) {
    indexItem(parts[i], context, index, used);
  }
}

function indexItem(term, context, index, used) {
  if (term.length > 3 && !used[term]) {
    term = (term.match(/^[\*(`\.)]*([^\*(`)]*)[\*)`\.)]*$/) || {1: ''})[1]; 
    if (term.length === 0) return;
    var scopedIndex = index[term];
    if (!scopedIndex) {
      index[term] = [];
      scopedIndex = index[term];
    }
    scopedIndex.push(context);
    used[term] = true;
  }
}
