const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom resolver to handle InternalBytecode.js references
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Skip InternalBytecode.js as it's a Hermes internal file
    if (moduleName === 'InternalBytecode.js' || moduleName.includes('InternalBytecode.js')) {
      return {
        type: 'empty',
      };
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
