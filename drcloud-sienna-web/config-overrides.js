const path = require('path');
const { paths } = require('react-app-rewired');
const rewireAliases = require('react-app-rewire-aliases');

module.exports = function override(config, env) {
  config = rewireAliases.aliasesOptions({
    '@api': path.resolve(__dirname, 'src/api'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@common': path.resolve(__dirname, 'src/common'),
    '@context': path.resolve(__dirname, 'src/context'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@store': path.resolve(__dirname, 'src/store'),
    '@utils': path.resolve(__dirname, `${paths.appSrc}/utils`),
    '@views': path.resolve(__dirname, 'src/views'),
    '@hook': path.resolve(__dirname, 'src/hook')
  })(config, env);

  return config;
};
