
module.exports = {
  snippets: {
    package: function(pkg) {
      var PackageWrapperView = require('../views/package-wrapper-view');
      var PackageView = require('../views/package-view');      
      return new PackageWrapperView({model: pkg}, new PackageView({model: pkg}));
    },
    method: function(method) {
      var PackageWrapperView = require('../views/package-wrapper-view');
      var MethodView = require('../views/method-view');
      return new PackageWrapperView({model: method.parent, showPackageDetails: true}, new MethodView({model: method}));
    },
    api: function(api) {
      var APIView = require('../views/api-view');
      var ProjectWrapperView = require('../views/project-wrapper-view');
      return new ProjectWrapperView({model: api, title: api.project.get('title')}, new APIView({model: api}));
    },
    section: function(section) {
      var SectionView = require('../views/section-view');
      var ProjectWrapperView = require('../views/project-wrapper-view');
      return new ProjectWrapperView({model: section, title: section.project.get('title')},
        new SectionView({model: section, topLevel: true}));
    },
    summary: function(project) {
      var SummaryView = require('../views/project-summary-view');
      var ProjectWrapperView = require('../views/project-wrapper-view');
      return new ProjectWrapperView({model: section, title: project.get('title')},
        new SummaryView({model: project}));
    },
    project: function(project) {
      var ProjectView = require('../views/project-page-view');
      var ProjectWrapperView = require('../views/project-wrapper-view');
      return new ProjectWrapperView({model: project, title: project.get('title')},
        new ProjectView({model: project}));
    },
  },
  jumpTo: function(model, self) {
    return function(e) {
      e.preventDefault();
      var viewState = self.props.viewState;
      var url = model.viewUrl(true, true);
      if (viewState) {
        url = viewState.toUrl(url);
      }
      Backbone.history.navigate(url, {replace: false, trigger: false});

      self.props.onJumpTo(model);
    };
  },
  snippetTo: function(type, model, self) {
    return function(e) {
      e.preventDefault();
      var viewState = self.props.viewState;
      var url = model.viewUrl(true, false);
      if (viewState) {
        url = viewState.toUrl(url);
      }
      Backbone.history.navigate(url, {replace: false, trigger: false});
      self.props.onSnippetTo(type, model);
    };
  },
  domIdify: function(id) {
    return encodeURIComponent(id).replace(/[%\.\{\}]/g, '_');
  }
};
