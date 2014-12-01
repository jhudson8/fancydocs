/** @jsx React.DOM */

var SideNavHeader = require('./side-nav-header');

var FOCUS_MAP = {
  outline: require('./side-nav-outline'),
  packages: require('./side-nav-packages'),
  methods: require('./side-nav-methods'),
  projects: require('./side-nav-projects'),
};

module.exports = React.createClass({
  mixins: ['modelChangeAware', 'events'],

  events: {
    'ref:header:focus': 'onFocus'
  },

  getInitialState: function() {
    return {
      viewState: this.props.viewState
    };
  },

  render: function() {
    var project = this.getModel();
    var viewState = this.state.viewState;
    var focus = viewState.focus;
    if (!focus) {
      focus = SideNavHeader.defaultFocus(project);
      viewState.updateFocus(focus);
    }

    var content = new FOCUS_MAP[focus]({
      ref: 'body',
      model: project,
      viewState: viewState,
      onJumpTo: this.props.onJumpTo,
      onSnippetTo: this.props.onSnippetTo
    });

    return (
      <div className="sidebar" key="nav">
        <SideNavHeader key={focus} ref="header" viewState={this.state.viewState} model={project} onNavSelection={this.props.onNavSelection}/>
        <div className="project-nav">
          {content}
        </div>
      </div>
    );
  },

  onFocus: function(focus) {
    this.props.onFocusChange(focus);
  }
});
