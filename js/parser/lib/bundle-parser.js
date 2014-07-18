var util = require('./util');

module.exports = function(section) {
  var projects = [];
  _.each(section.content, function(line) {
    var match = line.match(/\s*\*?\s*\[([^\]]*)]\(([^\)]*)\)/);
    if (match) {
      projects.push({id: match[1], url: match[2]});
    }
  });
  return projects;
};
