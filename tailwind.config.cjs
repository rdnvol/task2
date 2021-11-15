module.exports = {
  // mode: 'jit',
  purge: {
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
      'xs': '375px',
      'sm': '576px',
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

    columns: {
      auto: 'auto',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      '3xs': '16rem',
      '2xs': '18rem',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
    },

    spacing: {
      px: '1px',
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
    },

    cursor: {
      auto: 'auto',
      default: 'default',
      pointer: 'pointer',
      wait: 'wait',
      text: 'text',
      move: 'move',
      help: 'help',
      'not-allowed': 'not-allowed',
    },

    width: {
      auto: 'auto',
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      '11/12': '91.666667%',
      '100': '100%',
      screen: '100vw',
      min: 'min-content',
      max: 'max-content',
    },

    height: {
      auto: 'auto',
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      '100': '100%',
      screen: '100vh',
      min: 'min-content',
      max: 'max-content',
    },

    order: {
      first: '-9999',
      last: '9999',
      none: '0',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
    },

    zIndex: {
      auto: 'auto',
      0: '0',
      10: '10',
      20: '20',
      30: '30',
      40: '40',
      50: '50',
      100: '100',
      999: '999',
      1000: '1000',
      1001: '1001',
      1002: '1002',
    },
  },

  variants: {
    extend: {},
  },

  corePlugins: [
    'preflight',

    // LAYOUT
    'container',
    'boxSizing',
    'display',
    'float',
    'isolation',
    'objectFit',
    'objectPosition',
    'overflow',
    'overscrollBehavior',
    'position',
    'inset',
    'visibility',
    'zIndex',

    // FLEXBOX AND GRID
    'flexDirection',
    'flexWrap',
    'flex',
    'flexGrow',
    'flexShrink',
    'order',
    'gridTemplateColumns',
    'gridColumn',
    'gridColumnStart',
    'gridColumnEnd',
    'gridTemplateRows',
    'gridRow',
    'gridRowStart',
    'gridRowEnd',
    'gridAutoFlow',
    'gridAutoColumns',
    'gridAutoRows',
    'gap',
    'justifyContent',
    'justifyItems',
    'justifySelf',
    'alignContent',
    'alignItems',
    'alignSelf',
    'placeContent',
    'placeItems',
    'placeSelf',

    // SPACING
    'padding',
    'margin',
    'space',

    // SIZING
    'width',
    'minWidth',
    'maxWidth',
    'height',
    'minHeight',
    'maxHeight',

    // TYPOGRAPHY
    'textAlign',
    'textOpacity',
    'textDecoration',
    'textTransform',
    'textOverflow',
    'verticalAlign',
    'whitespace',
    'wordBreak',

    // EFFECTS
    'opacity',
    'mixBlendMode',
    'backgroundBlendMode',

    // TABLES
    'borderCollapse',
    'tableLayout',

    // ACCESSIBILITY
    'accessibility',
  ],

  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
