const getWorkspaces = require('get-yarn-workspaces')
const path = require('path')

function rewireYarnWorkspaces(config, env, from) {
  const babel = config.module.rules
    .find(rule => 'oneOf' in rule)
    .oneOf.find(rule => /babel-loader/.test(rule.loader))
    
    if (!Array.isArray(babel.include)) {
      babel.include = [babel.include]
  }
  
  babel.include = babel.include.concat(getWorkspaces(from).map((directory) => path.resolve(directory)))
  
  return config
}

module.exports = function override(config, env) {
  return rewireYarnWorkspaces(config, env);
};
