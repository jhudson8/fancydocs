/** @jsx React.DOM */

module.exports = React.createClass({
  displayName: 'ProjectNotFound',

  render: function() {
    var org = this.props.org,
        repo = this.props.repo,
        body;

    if (org == '{organization}' && repo === '{repo}') {
      // they clicked on the README example link
      body = (
        <div>
          <div className="ui large header">
            That was an example link only
          </div>
          <p>
            You're actually supposed to replace <strong>{'{organization}'}</strong> and <strong>{'{repo}'}</strong> with your own settings.
          </p>
          <p>
            It would look something like this: <a href="http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/backbone-reaction">http://jhudson8.github.io/fancydocs/index.html#project/jhudson8/backbone-reaction</a>.
          </p>
          <p>
            By the way, <strong>backbone-reaction</strong> was used to build the <strong>fancydocs</strong> application.
          </p>
        </div>
      );
    } else {
      body = (
        <div>
          <div className="ui large header">
            Sorry, {org + '/' + repo}  hasn't added <strong>fancydocks</strong>
          </div>
          <p>
            Would you like to <a href={'https://github.com/' + org + '/' + repo + '/issues'}>create an issue</a> to ask for fancydoc support?
          </p>
        </div>
      );
    }

    return (
      <div className="pad-all restrict-width">
        <div className="ui message">
          <div className="header">fancydocs</div>
        </div>
        <div className="ui segment attached top">
          {body}
        </div>
      </div>
    );
  }
});
