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
          {api.description}
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
            <Markdown tag="p" className="sub header" body={project.get('summary')}/>
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

var IconSection = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var child;
    if (this.props.children !== undefined) {
      child = this.props.children;
    } else {
      child = <p dangerouslySetInnerHTML={{__html: converter.makeHtml(this.props.body)}}/>
    }
    var Header = React.DOM[this.props.type || 'h3'];
    var subHeader;
    if (this.props.subHeader) {
      subHeader = <Markdown className="sub header" body={this.props.subHeader}/>
    }

    return (
      <div id={this.props.id} className={'ui icon message ' + (this.props.className || '')}>
        <i className={this.props.icon + ' icon'}></i>
        <div className="content">
          <div className="header">{this.props.header}</div>
          {this.props.children}
        </div>
      </div>
    );
  }
});

var TitledSection = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var child;
    if (this.props.children !== undefined) {
      child = this.props.children;
    } else {
      child = <p dangerouslySetInnerHTML={{__html: converter.makeHtml(this.props.body)}}/>
    }
    var Header = React.DOM[this.props.type || 'h3'];
    var subHeader;
    if (this.props.subHeader) {
      subHeader = <Markdown className="sub header" body={this.props.subHeader}/>
    }

    return (
      <div id={this.props.id} className={'ui segment ' + (this.props.className || '')}>
        <Header className={'ui header ' + (this.props.headerClass || '')}>
          {this.props.header}
          {subHeader}
        </Header>
        {child}
      </div>
    );
  }
});

var ToggleSection = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var mixin = this.getModel();

    return (
      <div className="ui basic accordion field">
        <div className="title">
          <i className="icon dropdown"></i>
          {this.props.label}
        </div>
        <div className="content field">
          {this.props.children}
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    $(this.getDOMNode()).accordion();
  },

  componentWillUnmount: function() {
    $(this.getDOMNode()).accordion('destroy');
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

