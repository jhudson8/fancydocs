/** @jsx React.DOM */

var converter = new Showdown.converter();

module.exports = React.createClass({
  render: function() {
    var Container = React.DOM[this.props.tag || 'div'];
    return (
      <Container className={this.props.className} dangerouslySetInnerHTML=
        {{__html: converter.makeHtml(this.props.body || (this.props.children && this.props.children.toString()) || '')}}/>
    );
  }
});
