import camelCase from "lodash.camelcase";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
// import { terser } from "rollup-plugin-terser"

// tslint:disable-next-line
const pkg = require("./package.json");

const libraryName = "fuzzify-pashto";

export default {
  external: [],
  input: `src/${libraryName}.ts`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: "umd", sourcemap: true },
    { file: pkg.module, format: "es", sourcemap: true },
  ],
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn"t understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use "external" to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    // terser(), (Enable when figure out licensing preserving)
    // Resolve source maps to the original source
    sourceMaps(),
  ],
  // Indicate here external modules you don"t wanna include in your bundle (i.e.: "lodash")
  watch: {
    include: "src/**",
  },
};
