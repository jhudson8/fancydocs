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
    var focus = viewState.focus || SideNavHeader.defaultFocus(project);
    viewState.focus = focus;
    var content = new FOCUS_MAP[focus]({
      ref: 'body',
      model: project,
      viewState: viewState,
      onJumpTo: this.props.onJumpTo,
      onSnippetTo: this.props.onSnippetTo
    });

    return (
      <div className="sidebar">
        <SideNavHeader ref="header" viewState={this.state.viewState} model={project}/>
        {content}
      </div>
    );
  },

  onFocus: function(focus) {
    var viewState = this.state.viewState;
    if (focus != viewState.focus) {
      viewState.updateFocus(focus);
    }
    this.forceUpdate();
  }
});
