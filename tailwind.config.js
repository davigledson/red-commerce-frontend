import flowbite from 'flowbite/plugin';
import flowbiteReact from 'flowbite-react/plugin/tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite,
    flowbiteReact,
  ],
}
