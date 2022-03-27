const path = require('path')
const SassRuleRewire = require('react-app-rewire-sass-rule')
const rewireAliases = require('react-app-rewire-aliases')

module.exports = function override(config, env) {
  require('react-app-rewire-postcss')(config, {
    plugins: loader => [require('postcss-rtl')()]
  })

  config = rewireAliases.aliasesOptions({
    '@core': path.resolve(__dirname, 'src/@core'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@layouts': path.resolve(__dirname, 'src/layouts'),
    '@configs': path.resolve(__dirname, 'src/configs'),
    '@utility': path.resolve(__dirname, 'src/utility'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@store': path.resolve(__dirname, 'src/redux'),
    '@views': path.resolve(__dirname, 'src/views'),
    '@api': path.resolve(__dirname, 'src/api'),
    '@hoc': path.resolve(__dirname, 'src/hoc'),
    '@sections': path.resolve(__dirname, 'src/sections')
  })(config, env)

  config = new SassRuleRewire()
    .withRuleOptions({
      test: /\.s[ac]ss$/i,
      use: [
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              includePaths: ['node_modules', 'src/assets']
            }
          }
        }
      ]
    })
    .rewire(config, env)

  return config
}
