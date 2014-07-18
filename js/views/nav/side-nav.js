/** @jsx React.DOM */

var SideNavHeader = require('./side-nav-header');

var FOCUS_MAP = {
  outline: require('./side-nav-outline'),
  packages: require('./side-nav-packages'),
  methods: require('./side-nav-methods'),
  projects: require('./side-nav-projects'),
};

module.exports = React.createClass({
  mixins: ['modelChangeAware'],

  render: function() {
    var project = this.getModel();
    var focus = project.get('focus');
    var content = new FOCUS_MAP[focus]({
      model: project,
      hilight: this.props.hilight
    });

    return (
      <div className="sidebar">
        <SideNavHeader ref="header" focus={focus} onFocus={this.onFocus} model={project}/>
        {content}
      </div>
    );
  },

  onFocus: function(focus) {
    this.getModel().set('focus', focus);
  }
});
