/** @jsx React.DOM */

var marked = require('marked');
var options = {
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
};
marked.setOptions(options);

module.exports = React.createClass({
  getInitialState: function() {
    return {
      id: this.props.id || _.uniqueId('md-')
    };
  },
  render: function() {
    var Container = React.DOM[this.props.tag || 'div'];
    var html = marked(
      this.props.body || (this.props.children && this.props.children.toString()) || '', options).replace(/id=\"[^"]*"/g, '');
    
    return (
      <Container key={this.state.id} id={this.props.id}>
        <div className={this.props.className} dangerouslySetInnerHTML={{__html: html}}/>
      </Container>
    );
  },


});
