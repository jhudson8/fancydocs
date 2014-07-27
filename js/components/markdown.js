/** @jsx React.DOM */

var converter = new Showdown.converter();

module.exports = React.createClass({
  getInitialState: function() {
    return {
      id: this.props.id || _.uniqueId('md-')
    };
  },
  render: function() {
    var Container = React.DOM[this.props.tag || 'div'];
    var html = converter.makeHtml(
      this.props.body || (this.props.children && this.props.children.toString()) || '').replace(/id=\"[^"]*"/g, '');
    
    return (
      <Container key={this.state.id} id={this.props.id}>
        <div className={this.props.className} dangerouslySetInnerHTML={{__html: html}}/>
      </Container>
    );
  },


});
