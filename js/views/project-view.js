/** @jsx React.DOM */

var Markdown = require('../components/markdown');
var SideNav = require('./nav/side-nav');
var navUtil = require('./nav/nav-util');
var SnippetView = require('./snippet-link-view');
var APIView = require('./api-view');
var SectionView = require('./section-view');
var ProjectPage = require('./project-page-view');
var util = require('../utils/util');
var SideNavHeadr = require('./nav/side-nav-header');

module.exports = React.createClass({
  mixins: ['modelChangeAware'],

  getInitialState: function() {
    return {
      viewState: this.props.viewState
    };
  },

  render: function() {
    var project = this.getModel();
    var children = [];
    var viewState = this.state.viewState;
    var snippet = viewState.snippet;
    var focus = viewState.focus;

    if (focus === 'outline' && !project.hasChildren()) {
      // we don't do snippets in outline but the url might show that
      snippet = undefined;
    }

    if (snippet) {
      var factory = function() {
        return util.snippets[snippet.type](snippet.model, project);
      };
      children = new SnippetView({ref: 'snippet', key: snippet.model.id, model: snippet.model, project: project, factory: factory,
        snippet: snippet, onJumpTo: this.jumpToModel});
    }
    else {
      children = this.getProjectPage();
    }

    return (
      <div key={'project-' + project.id}>
        <div>
          <SideNav ref="nav" key={focus} model={project} viewState={viewState} onJumpTo={this.jumpToModel}
              onSnippetTo={this.snippetTo} onFocusChange={this.onFocusChange}/>
          <div className="page-body">
            {children}
          </div>
        </div>
      </div>
    );
  },

  getProjectPage: function() {
    var project = this.getModel();
    return (
      <div className="pad-all">
        <ProjectPage model={project} viewState={this.state.viewState}/>
      </div>
    );
  },

  componentDidMount: function() {
    this.jumpTo(this.state.viewState.jumpTo);
    this.state.viewState.jumpTo = undefined;
  },

  componentDidUpdate: function() {
    this.jumpTo(this.state.viewState.jumpTo);
    this.state.viewState.jumpTo = undefined;
  },

  snippetTo: function(type, model) {
    var viewState = this.state.viewState;
    viewState.snippet = {
      type: type,
      model: model
    };
    viewState.jumpTo = 'top';
    this.forceUpdate();
  },

  jumpToModel: function(model) {
    var viewState = this.state.viewState;
    viewState.snippet = undefined;
    if (model.domId) {
      viewState.jumpTo = model.domId();
    }
    this.forceUpdate();
    var self = this;
    _.defer(function() {
      self.jumpTo(viewState.jumpTo);
    });
  },

  jumpTo: function(jumpTo) {
    if (this.isMounted() && jumpTo) {
      if (jumpTo === 'top' || jumpTo === 'summary') {
        return window.scrollTo(0, 0);
      }
      var finder;
      if (jumpTo) {
        if (jumpTo === 'summary') {
          finder = '.project-summary';
        } else {
          finder = '#' + jumpTo;
        }
      }
      if (finder) {
        var el = $(this.getDOMNode()).find(finder)[0];
        if (el) {
          var pos = $(el).offset();
          // add to because of the fixed header
          window.scrollTo(0, Math.floor(pos.top - 8));
        }
      }
    }
  },

  onFocusChange: function(focus) {
    var viewState = this.state.viewState;
    if (focus != viewState.focus) {
      viewState.updateFocus(focus);
      this.forceUpdate();
    }
  }
});
