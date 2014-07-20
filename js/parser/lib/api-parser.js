var util = require('./util');

module.exports = function(section) {
  var rtn = {
    methods: {}
  };

  var headerFooter = util.firstTitle(section.content, h3Pattern),
      description = util.trimAndJoin(headerFooter.header);
  if (description) {
    rtn.description = description;
  }

  util.contentHandlers.packages({content: headerFooter.footer}, rtn);
  return rtn;
};
