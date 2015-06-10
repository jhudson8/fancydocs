/** @jsx React.DOM */
var navUtil = require('./nav-util');
var util = require('../../utils/util');

module.exports = React.createClass({
  displayName: 'SideNavOutline',
  mixins: ['modelChangeAware', 'events'],

  render: function() {
    var self = this,
        project = this.getModel(),
        viewState = this.props.viewState,
        navItems = [];

    this.addProject(project, navItems, 1, {maxLevel: 3});

    var jumpTo = true;
    var snippet = false;
    var hasChildren = project.hasChildren();
    if (hasChildren) {
      // parent projects won't jump to content that isn't there so use snippets since content might be in child projects
      jumpTo = false;
      snippet = true;
    }
    return navUtil.projectNavMenu(navItems, this, viewState, {jumpTo: jumpTo, snippet: snippet, key: 'outline'});
  },

  addProject: function(project, children, level, options) {
    children.push({
      key: project.id + '-summary',
      label: 'Summary',
      url: project.viewUrl() + '/summary'
    });
    if (project.get('installation')) {
      children.push({
        key: project.id + '-installation',
        label: 'Installation',
        url: project.viewUrl() + '/installation'
      });
    }

    this.addSection(project, children, level, options);

    _.each(project.api, function(apiModel, name) {
      this.addAPI(name, apiModel, project, children, options);
    }, this);

    if (project.bundledProjects) {
      project.bundledProjects.each(function(project) {
        var _children = [];
        this.addProject(project, _children, level+1, _.defaults({hidePackages: true, summary: false, snippet: true}, options));
        children.push({
          key: project.id,
          label: project.get('title'),
          model: project,
          type: 'project',
          options: options,
          children: _children
        });
      }, this);
    }
  },

  addAPI: function(name, apiModel, project, children, options) {
    var self = this;
    var apiChildren = [];
    children.push({
      key: project.id + '-api-' + name,
      model: apiModel,
      label: name,
      type: 'api',
      options: options,
      children: !options.hidePackages && apiModel.map(function(pkg) {
        return {
          model: pkg,
          key: pkg.id,
          label: pkg.get('name'),
          type: 'package',
          icon: navUtil.icons.package,
          options: options,
          children: !options.hideMethods && pkg.methods.map(function(method) {
            return {
              key: method.id,
              model: method,
              label: method.get('name'),
              type: 'method',
              icon: navUtil.icons.method,
              options: options
            };
          })
        };
    })});
  },

  addSection: function(section, children, level, options) {
    if (level > (options.maxLevel || 3)) {
      return;
    }
    if (section) {
      section.sections.each(function(section) {
        var _children = [];
        this.addSection(section, _children, level + 1, options);

        children.push({
          key: section.id,
          label: section.get('title'),
          model: section,
          type: 'section',
          options: options,
          children: _children
        });
      }, this);
    }
  }
});

