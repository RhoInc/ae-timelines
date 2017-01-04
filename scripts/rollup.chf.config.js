import babel from "rollup-plugin-babel";

module.exports = {
  entry: "./src/chartfoundry/util/Renderer.js",
  format: "umd",
  globals: {
    webcharts: "webCharts",
    d3: "d3",
    react: "React"
  },
  moduleName: "aeTimelines",
  plugins: [
    babel(
      {
        "presets": [
          [
            "es2015",
            {
              "modules": false
            }
          ]
        ],
        "plugins": [
          "external-helpers"
        ],
        "exclude": "node_modules/**"
      })
  ]
};
