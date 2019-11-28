const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#08979C',
      '@layout-header-background': '#002329',
      '@heading-color': '#2F3640',
      '@text-color': '#262626',
      '@text-color-secondary': '#595959'
    }
  })
);
