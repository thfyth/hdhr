
#  项目情况

使用了vue-elementui-admin框架，搭建了动态权限控制菜单
出于约定优于配置观念，它会自动加载views目录下的所有config/router.js路由文件。
- `path`路径会自动注入，注入规则为config所在的views下的路径。
- `name`与`path`注入相同，可以在每个router.js文件中自定义**强烈推荐自定义name**。有一点需要注意，`name`的值必须和后台配置的的值一致。通过`name`值获取本地的`component`对象。如果使用keep-alive来缓存组件将`meta`中的`noCahce`设置成`false`，并且缓存的组件`name`一定要设置。**如果缓存失效请查看路由中的`name`属性值和组件内部name的名称是否一致，区分大小写**[路由相关配置请看](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html#config)。  
[在线地址](https://git.io/Ladmin)

## Build Setup

```bash
# 克隆项目
git clone https://github.com/PanJiaChen/vue-admin-template.git

# 进入项目目录
cd vue-admin-template

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
