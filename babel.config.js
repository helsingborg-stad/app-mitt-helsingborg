module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "@babel/plugin-transform-flow-strip-types",
    "@babel/plugin-proposal-class-properties",
    /**
     * Resolve custom alias paths in Babel
     */
    [
      require.resolve("babel-plugin-module-resolver"),
      {
        root: ["./"],
        alias: {
          app: "./source",
        },
      },
    ],
  ],
};
