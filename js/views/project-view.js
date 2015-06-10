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
  displayName: 'ProjectView',
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
    var className = this.state.navEnabled ? 'nav-enabled' : '';

    if (snippet) {
      var factory = function() {
        return util.snippets[snippet.type](snippet.model, project);
      };
      children = <SnippetView ref="snippet" key={snippet.model.id} model={snippet.model} project={project}
        factory={factory} snippet={snippet} onJumpTo={this.jumpToModel}/>;
    }
    else {
      children = this.getProjectPage();
    }

    return (
      <div key={'project-' + project.id} className={className}>
        <div>
          <SideNav ref="nav" key={focus} model={project} viewState={viewState} onJumpTo={this.jumpToModel}
              onSnippetTo={this.snippetTo} onFocusChange={this.onFocusChange} onNavSelection={this.onNavSelection}/>
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
      <div className="pad-all project-container-view">
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
    this.setState({navEnabled: false, currentHeader: false});
    this.forceUpdate();
  },

  jumpToModel: function(model) {
    var viewState = this.state.viewState;
    viewState.snippet = undefined;
    if (model.domId) {
      viewState.jumpTo = model.domId();
    }
    this.setState({navEnabled: false, currentHeader: false});
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

      if (jumpTo) {
        var self = this;
        setTimeout(function() {
          var finder = '#' + jumpTo;
          var el = $(self.getDOMNode()).find(finder)[0];
          if (el) {
            var pos = $(el).offset();
            // add to because of the fixed header
            $('html, body').animate({
              scrollTop: Math.floor(pos.top - 8)
            }, 300);
          }
        }, 500);
      }
    }
  },

  onFocusChange: function(focus) {
    var viewState = this.state.viewState;
    if (focus != viewState.focus) {
      viewState.updateFocus(focus);
    }
    this.onNavSelection({type: 'header', value: focus});
  },

  onNavSelection: function(data) {
    if (data.type === 'header') {
      var currentHeader = this.state.currentHeader;
      if (currentHeader === data.value) {
        // switch off
        this.setState({navEnabled: false, currentHeader: false});
      } else {
        this.setState({navEnabled: true, currentHeader: data.value});
      }
    } else {
      this.setState({navEnabled: false, currentHeader: false});
    }
  }
});
