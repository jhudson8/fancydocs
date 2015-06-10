
module.exports = {
  snippets: {
    package: function(pkg, project) {
      var PackageWrapperView = require('../views/package-wrapper-view');
      var PackageView = require('../views/package-view');      
      return <PackageWrapperView model={pkg} project={project}>
         <PackageView model={pkg}/>
      </PackageWrapperView>;
    },
    method: function(method, project) {
      var PackageWrapperView = require('../views/package-wrapper-view');
      var MethodView = require('../views/method-view');
      return <PackageWrapperView model={method.parent} project={project} showPackageDetails={true}>
        <MethodView model={method}/>
      </PackageWrapperView>;
    },
    api: function(api, project) {
      var APIView = require('../views/api-view');
      var ProjectWrapperView = require('../views/project-wrapper-view');
      return <ProjectWrapperView model={api} title={api.project.get('title')} project={project}>
        <APIView model={api}/>
      </ProjectWrapperView>;
    },
    section: function(section, project) {
      var SectionView = require('../views/section-view');
      var ProjectWrapperView = require('../views/project-wrapper-view');
      return <ProjectWrapperView model={section} title={section.project.get('title')} project={project}>
        <SectionView model={section} topLevel={true}/>
      </ProjectWrapperView>;
    },
    summary: function(project, parentProject) {
      var SummaryView = require('../views/project-summary-view');
      var ProjectWrapperView = require('../views/project-wrapper-view');
      return <ProjectWrapperView model={section} title={project.get('title')} project={parentProject}>
        <SummaryView model={project}/>
      </ProjectWrapperView>;
    },
    project: function(project, parentProject) {
      var ProjectView = require('../views/project-page-view');
      var ProjectWrapperView = require('../views/project-wrapper-view');
      return new ProjectWrapperView({model: project, title: project.get('title'), project: parentProject},
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
  },

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
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
};
