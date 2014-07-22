/** @jsx React.DOM */

var projectManager = require('../utils/project-manager');

module.exports = React.createClass({
  render: function() {
    var parsed = (this.state || {}).parsed,
        actionButtons = <button className="ui green button" type="submit">Give me the fancydocs</button>;


    if (parsed) {
      // this sucks but jsx parser screws up on js reserved words
      var _public = 'public';
      var processed = 'registerProject(' + parsed + ');';
      parsed = (
        <div>
          <div className="centered">
            <i className="huge centered download icon"/>
          </div>
          <br/>
          <div className="field">
            <label>Here is your fancydoc file content</label>
            <textarea className="markdown-entry" defaultValue={parsed}/>
          </div>

          <button type="button" className="ui green button" onClick={this.preview(parsed)}>Preview your project</button>
          <p>
            If you like what you see, copy the fancydoc contents to your repository <a href="https://pages.github.com">public branch</a> (<strong>gh-pages</strong>) as /fancydocs.js.

            <br/><br/>

            Then, just browse to <a href={'http://jhudson8.github.io/fancydocs/index.html#project/{organization}/{repo}'}>
              {'http://jhudson8.github.io/fancydocs/index.html#project/{organization}/{repo}'}
              </a> and see the magic happen.
          </p>
        </div>
      );

      actionButtons = <button type="button" className="ui button" onClick={this.startOver(parsed)}>Start Over</button>;
    }

    return (
      <div className="pad-all restrict-width">
        <div className="ui message">
          <div className="header">fancydocs</div>
        </div>
        <div className="ui segment attached top">
          <h2 className="ui header">Fancydocify your markdown file</h2>

          <form onSubmit={this.onSubmit}>
            <div className="ui form segment">
              <div className="field">
                <label>Paste your markdown file content below</label>
                <textarea className="markdown-entry" ref="input" disabled={!!parsed}/>
              </div>

              {parsed}
            </div>

            {actionButtons}
          </form>
        </div>
      </div>
    );
  },

  onSubmit: function(e) {
    e.preventDefault();
    var text = this.refs.input.getDOMNode().value.trim();
    if (text) {
      try {
        var parsed = require('../parser/parser')(text);
        this.setState({parsed: parsed});
      } catch (e) {
        console.error(e);
        alert('the markdown file is invalid (working on meaningful error reporting)')
      }
    } else {
      alert('You need to ernter your file contents first.')
    }
  },

  preview: function(data) {
    return function(event) {
      event.preventDefault();
      var orgName = window.localStorage && localStorage.getItem('defaultOrgName');
      orgName = prompt('What is your github user/organization name?', orgName || '');
      if (orgName) {
        localStorage && localStorage.setItem('defaultOrgName', orgName);
        projectManager.viewTempProject(orgName, data);
      }
    }
  },

  startOver: function(data) {
    var self = this;
    return function(event) {
      event.preventDefault();
      self.setState({parsed: false});
    }
  }
});
