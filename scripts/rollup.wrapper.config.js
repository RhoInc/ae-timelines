import babel from "rollup-plugin-babel";

module.exports = {
  moduleName: 'aeTimelines',
  entry: './src/wrapper.js',
  format: 'iife',
  globals: {
    webcharts: 'webCharts',
    d3: 'd3'
  },
  plugins: [
    babel(
      {
        'presets': [
          [
            'es2015',
            {
              'modules': false
            }
          ]
        ],
        'plugins': [
          'external-helpers'
        ],
        'exclude': 'node_modules/**'
      })
  ]
}; 
