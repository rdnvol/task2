module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-preset-env')({
      features: { 'nesting-rules': false }
    }),
  ],
};
