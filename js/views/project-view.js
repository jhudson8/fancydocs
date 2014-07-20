/** @jsx React.DOM */

var Markdown = require('../components/markdown');
var SideNav = require('./nav/side-nav');
var converter = new Showdown.converter();
var navUtil = require('./nav/nav-util')

module.exports = React.createClass({
  mixins: ['modelChangeAware'],

  render: function() {
    var hilight = this.props.hilight || {};
    var project = this.getModel();
    var children = [];
    var overview = project.get('overview');
    if (overview) {
      children.push(
        <Markdown tag="p" className="overview-container" body={overview}/>
      );
    }

    _.each(project.api, function(api, name) {
      var packages = api.map(function(pkg, name) {
        return <PackageView model={pkg}/>
      }, this);
      children.push(
        <div className="main-section">
          <h3 className="ui header">{name}</h3>
          <div className="ui divider"/>
          <Markdown body={api.description}/>
          {packages}
        </div>
      );
    }, this);

    this.hilight();
    return (
      <div>
        <SideNav model={project} hilight={hilight}/>
        <div>
          <div className="ui attached message">
            <div className="header">
              {project.get('name')}
            </div>
          </div>
          <div className="pad-all">
            <span className="github-label">
              <a href={'https://github.com/' + project.get('repo') + '/' + project.get('name')} className="ui purple label">
                {'github.com/' + project.get('repo') + '/' + project.get('name')}
              </a>
            </span>
            <Markdown tag="p" className="sub header" body={project.get('summary')}/>
            <BundledProjectsSection model={project}/>
            {children}
            <ProjectSectionList model={project.sections} level={3}/>
          </div>
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    this.hilight();
  },

  hilight: function() {
    var finder;
    if (this.isMounted()) {
      var hilight = this.getModel().get('hilight');
      if (hilight) {
        if (hilight.top) {
          return window.scrollTo(0, 0);
        }

        if (hilight.overview) {
          finder = '.overview-container';
        } else {
          var id = hilight.section || hilight.package || hilight.method;
          finder = id && ('#' + id);
        }
      }
      if (finder) {
        var el = $(this.getDOMNode()).find(finder)[0];
        if (el) {
          el.scrollIntoView();
        }
      }
    }
  }
});

var PackageView = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var pkg = this.getModel(),
        project = pkg.project,
        hilight = project.get('hilight'),
        methods = pkg.methods.map(function(method) {
          return <MethodView model={method} key={method.get('name')}/>
        }, this),
        overview = pkg.get('overview');
    if (overview) {
      overview = <Markdown tag="p" body={overview}/>
    }

    var className = hilight.package === pkg.id && 'green';

    return (
      <div id={pkg.id}>
        <h4 className={className}>
          <i className={navUtil.icons.package}/>
          {pkg.get('name')}
        </h4>
        {overview}
        {methods}
      </div>
    );
  }
});

var MethodView = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var method = this.getModel(),
        project = method.project,
        hilight = project.get('hilight'),
        name = method.get('name') + ' ' + _.map(method.get('profiles'), function(profile) {
          return '(' + profile + ')';
        }).join(' or '),
        parameters = _.map(method.get('params'), function(description, name) {
          return <tr><td>{name}:</td><td>{description}</td></tr>;
        }),
        summary = method.get('summary'),
        overview = method.get('overview');

    if (overview) {
      summary = summary + '\n\n' + overview;
    }
    if (parameters.length) {
      parameters = (
        <table className="ui table">
          <thead><tr><th colSpan="2">Parameters</th></tr></thead>
          {parameters}
        </table>
      );
    }
    var className = hilight.method === method.id && 'green',
        returns;
    if (method.get('returns')) {
      returns = <Markdown className="method-return" body={'return ' + method.get('returns')}/>
    }

    return (
      <div id={method.id} className={'ui segment'}>
        <h4 className={className}>
          <i className={navUtil.icons.method}/>
          {name}
        </h4>
        {parameters}
        {returns}
        <Markdown tag="p" body={summary}/>
      </div>
    );
  }
});

var BundledProjectsSection = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var project = this.getModel(),
        bundledProjects = project.get('bundledProjects');
    if (!project.bundledProjects || _.isEmpty(bundledProjects)) {
      return <div/>;
    } else {
      var children = _.map(bundledProjects, function(projectInfo) {
        var id = projectInfo.id, name = projectInfo.id;
        if (id.indexOf('/') < 0) {
          id = project.get('repo') + '/' + id;
        }
        return (
          <tr>
            <td><a href={'#project/' + id}>{name}</a></td>
            <Markdown tag='td' body={projectInfo.description}/>
          </tr>
        );
      });
    }
    return (
      <div className="main-section">
        <h3 className="ui header">Bundled Projects</h3>
        <div className="ui divider"/>
        <table className="ui basic table">
          {children}
        </table>
      </div>
    );
  }
});

var ProjectSectionList = React.createClass({
  mixins: ['modelAware'],
  render: function() {
    var level = this.props.level,
        tag = 'h' + level;
    var sections = (this.getModel() || []).map(function(section) {
      var title = React.DOM[tag]({className: 'ui header'}, section.get('title')),
          children;

      if (section.sections && section.sections.length) {
        children = new ProjectSectionList({model: section.sections, level: level+1});
      }
      if (level < 5) {
        var divider = (level === 3) ? <div className="ui divider"/> : undefined;
        return (
          <div id={section.id}>
            {title}
            {divider}
            <Markdown className="content" body={section.get('body')}/>
            {children}
          </div>
        );
      } else {
        return (
          <div id={section.id} className={'ui segment section level-' + level}>
            {title}
            <Markdown className="content" body={section.get('body')}/>
            {children}
          </div>
        );
      }
    });

    return <div className="main-section">{sections}</div>;
  }
});

