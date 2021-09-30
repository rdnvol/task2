module.exports = {
  mode: 'jit',
  purge: {
    enabled: false,
    content: [
      './**/*.liquid',
      './**/Components/*.js',
      './**/Components/*.jsx',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    screens: {
      'sm': '414px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1200px',
      '2xl': '1400px',
    },
    colors: {
      // Build your palette here
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
