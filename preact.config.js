
import asyncPlugin from 'preact-cli-plugin-fast-async';
const preactCliSwPrecachePlugin = require('preact-cli-sw-precache');

export default (config, env, helpers) => {
    asyncPlugin(config);
    const precacheConfig = {
    staticFileGlobs: [
        'build/**.css',
        'build/**.js',
        'build/index.html',
      ],
      stripPrefix: 'build/',
      runtimeCaching: [{
        urlPattern: /\api\/users\//,
        handler: 'networkFirst'
      }]
    };
    return preactCliSwPrecachePlugin(config, precacheConfig);
};
