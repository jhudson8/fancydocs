/** @jsx React.DOM */

(function() {
  var pattern = "\\[([^\\]]+)\\]\\(([^\\)]+)\\)";
  var a = function(a) {
    return [{
      type: "lang",
      regex: pattern,
      replace: function(val) {
        var match = val.match(new RegExp(pattern));
        if (match[2].match(/\.(png|jpg|jpeg|gif|tif|tiff)$/)) {
          // it's an image
          return '<img class="reference-image" src="' + match[2] + '" alt="' + match[1] + '"/>';
        } else {
          return '<a class="reference-link" href="' + match[2] + '">' + match[1] + '</a>';
        }
      }
    }];
  };

  Showdown.extensions.images = a;
})();

var converter = new Showdown.converter({ extensions: ['images'] });




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
