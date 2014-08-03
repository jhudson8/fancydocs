/** @jsx React.DOM */

var Markdown = require('../components/markdown');

module.exports = React.createClass({
  mixins: ['modelAware'],

  render: function() {
    var section = this.getModel();
    var level = (this.props.level || 3);
    var title = React.DOM['h' + (level)]({className: 'ui header'}, section.get('title'));
    var divider = (this.props.topLevel) ? (<div className="ui divider"/>) : undefined;

    var children = section.sections && section.sections.map(function(section) {
      return new module.exports({model: section, topLevel: false, level: level + 1});
    });

    return (
      <div id={section.domId()} key={'section-' + section.id}>
        {title}
        {divider}
        <Markdown className="content" body={section.get('body')}/>
        {children}
      </div>
    );
  }
});
