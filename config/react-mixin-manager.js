registerMixin({"title":"react-mixin-manager","summary":"Give your components advanced mixin capabilities including mixin grouping and aliasing with dependency management.\n\n***Problem:*** React mixins get cumbersome because, if they are done right, they should be as granular as possible.  This is can be difficult sometimes because ***a)*** mixins can not duplicate attribute names and ***b)*** mixins must assume that all required functionality is available (creating DRY issues with multiple mixins using the same basic functionality).\n\n***Solution:*** Provide a manager that allows registering mixins by an alias and allowing dependencies to be specified on that mixin.  By allowing mixins to be included by alias, we can determine all dependencies and ensure that they are included (and not duplicated) as well.\n\n1. React mixins can be much more granular (because they are reused)\n2. Reduce a lot of DRY code when it comes to mixins because they can depend on existing functionality\n3. Less chance of mixin duplicate function name collision (because they are more granular and reused)\n4. 3rd party mixins can expose internal behaviors as registered mixins to be overridden by consumers","api":{"API":{"methods":{},"packages":{"React.mixins":{"overview":"","methods":{"add":{"profiles":["mixinName, mixin[, dependsOn, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","mixin":"the mixin object","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Register the mixin to be referenced as the alias `mixinName` with any additional dependencies (by alias) as additional arguments.  This *will not* replace an existing mixin by that alias.","dependsOn":[],"overview":"*Standard mixin*\n```\n// register myMixinImpl as the alias \"myMixin\"\nReact.mixins.add('myMixin', myMixinImpl);\n...\nReact.createClass({\n  mixins: ['myMixin', anyOtherPlainOldMixin]\n})\n// myMixinImpl, anyOtherPlainOldMixin will be included\n```\n\n*Mixin with dependencies*\n```\n// register mixin1Impl as the alias \"mixin1\"\nReact.mixins.add('mixin1', mixin1Impl);\n// register mixin2Impl as the alias \"mixin2\" with a dependency on the mixin defined by the alias \"mixin1\"\nReact.mixins.add('mixin2', mixin2Impl, 'mixin1');\n...\nReact.createClass({\n  mixins: ['mixin2', anyOtherPlainOldMixin]\n})\n// mixin1Impl, mixin2Impl, anyOtherPlainOldMixin will be included (a named mixin will never be included multiple times)\n```\n***note***: if the registered mixin is a function, it will be executed and the return value will be used as the mixin"},"replace":{"profiles":["mixinName, mixin[, dependsOn, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","mixin":"the mixin object","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Same as ```React.mixins.add``` but it *will replace* an existing mixin with the same alias.","dependsOn":[],"overview":""},"inject":{"profiles":["mixinName, dependsOn[, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Add additional dependencies to a mixin that has already been registered.","dependsOn":[],"overview":""},"alias":{"profiles":["mixinName, dependsOn[, dependsOn, ...]"],"params":{"mixinName":"(string) the alias to be used when including the mixin for a React component","dependsOn":"(string or array) the alias of another mixin that must be included if this mixin is included"},"summary":"Define an alias which can be used to include multiple mixins.  This is similar to registering a mixin with dependencies without including the actual mixin.","dependsOn":[],"overview":""}}}}},"Mixins":{"methods":{},"packages":{"deferUpdate":{"overview":"","methods":{"deferUpdate":{"profiles":[""],"params":{},"summary":"This is similar to the standard *forceUpdate* but after a setTimeout(0).  Any calls to deferUpdate before the callback fires will execute only a single ```forceUpdate``` call.  This can be beneficial for mixins that listen to certain events that might cause a render multiple times unnecessarily.","dependsOn":[],"overview":""}}}}}}});