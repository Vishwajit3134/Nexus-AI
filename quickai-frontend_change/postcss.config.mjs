/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      // We must pass the typography plugin to Tailwind here
      plugins: [
        require('@tailwindcss/typography'),
      ],
    },
  },
};

export default config;