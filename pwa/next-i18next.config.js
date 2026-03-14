module.exports = {
  i18n: {
    locales: ['fr', 'ary', 'ar', 'en'],
    defaultLocale: 'fr',
    localeDetection: false, // Recommended for clear control
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
