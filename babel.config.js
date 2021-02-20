const proPlugins = [];// 开发环境 不做操作
// 生产环境，去掉console
if (process.env.NODE_ENV === 'production') {
    proPlugins.push('transform-remove-console');
}
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins:[
    ...proPlugins
  ]
  // "plugins": [
  //   [
  //     "component",
  //     {
  //       "libraryName": "element-ui",
  //       "styleLibraryName": "theme-chalk"
  //     }
  //   ]
  // ]
}
