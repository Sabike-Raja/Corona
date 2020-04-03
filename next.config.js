const withSass = require('@zeit/next-sass');
const withFonts = require('nextjs-fonts');
module.exports = withSass(withFonts({
  webpack(config, options) {
   return config;
  },
}));