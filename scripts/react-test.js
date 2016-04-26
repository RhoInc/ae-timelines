const fs = require('fs');
const path = require('path');
const rollup = require('rollup');

rollup.rollup({
  entry: './src/chartfoundry/util/Renderer.js'
})
.then((bundle) => {
  const result = bundle.generate({
    format: 'iife',
    globals: {
      webcharts: 'webCharts',
      d3: 'd3',
      react: 'React'
    },
    moduleName: 'aeTimelines'
  });
  console.log('bundled!');

  fs.writeFileSync(path.resolve(__dirname, '../build/aeTimeline-chf-test.js'), result.code);
})
.catch((error) => {
  console.log(error);
});
