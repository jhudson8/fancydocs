/** @jsx React.DOM */

module.exports = {
  icons: {
    package: 'archive icon',
    method: 'code icon',
    project: 'github icon',
    search: 'search icon',
  },

  reactifyMenuItems: function(children) {
    return _.map(children, function(data) {
      var active = data.active,
          url = data.url,
          model = data.model,
          onClick;
      if (data.model) {
        active = data.hilight[data.type] === model.id;
        url = model.viewUrl();
        var hilight = {};
        hilight[data.type] = model.id;
        onClick = module.exports.hilight(model.project, hilight);
      }

      var className = active ? 'item active green' : 'item';
      if (data.header) {
        className += ' header';
      }
      return (
        <a className={className} href={url} onClick={onClick}>
          <i className={data.icon + ' icon'}/>
          {data.label}
        </a>
      );
    });
  },

  menu: React.createClass({
    render: function() {
      return (
        <div className="vertical ui menu project-nav">
          {this.props.children}
        </div>
      );
    }
  }),

  hilight: function(project, hilight) {
    return function(event) {
      var href = event.currentTarget.getAttribute('href');
      if (href) {
        href = href.match(/#?(.*)/)[1];
        Backbone.history.navigate(href, {trigger: false, replace: false});
      }
      event.preventDefault();
      project.set('hilight', hilight);
    }
  }
};
