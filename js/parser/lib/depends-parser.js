var util = require('./util');

module.exports = function(section) {
  var projects = [];
  _.each(section.content, function(line) {
    var match = line.match(/\s*\*?\s*\[([^\]]*)]\(([^\)]*)\)\s*:?\s*(.*)/);
    if (match) {
      projects.push({id: match[1], url: match[2], description: match[3]});
    }
  });
  return projects;
};
