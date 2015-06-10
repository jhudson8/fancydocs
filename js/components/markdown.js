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

  componentDidMount: function() {
    this.testContent(this.props.body || (this.props.children && this.props.children.toString()));
  },

  componentWillReceiveProps: function(props) {
    this.testContent(props.body || (props.children && props.children.toString()));
  },

  testContent: function(content) {
    content = content || '';
    var self = this;
    var oldContent = this.state.content;
    if (oldContent !== content) {
      // we need to reload the content
      this.state.content = content;
      _.defer(function() {
        var html = marked(content || '', options).replace(/id=\"[^"]*"/g, '');
        self.getDOMNode().innerHTML = html;
      });
    }
  },

  render: function() {
    var Container = React.DOM[this.props.tag || 'div'];
    
    
    return React.createElement(this.props.tag || 'div', {key: this.state.id, id: this.props.id},
      <div className={this.props.className}/>
    );
  },
});
