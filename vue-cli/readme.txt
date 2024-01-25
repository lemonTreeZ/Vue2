1. 全局安装脚手架 npm install @vue/cli -g
2. 使用命令行创建项目 vue create 项目名称 根据提示进行 | 使用vue ui命令可视化创建项目
3. 通过@vue/cli + @vue/cli-service-global实现零配置原型开发 (快速开发vue单文件: vue serve -o xxx.vue)
4. Vue CLI 使用了一套基于插件的架构。如果你查阅一个新创建项目的 package.json，就会发现依赖都是以 @vue/cli-plugin- 开头的。插件可以修改 webpack 的内部配置，也可以向 vue-cli-service 注入命令。在项目创建的过程中，绝大部分列出的特性都是通过插件来实现的
5. 一个 Vue CLI preset 是一个包含创建新项目所需预定义选项和插件的 JSON 对象，让用户无需在命令提示中选择它们
6. 在 vue create 过程中保存的 preset 会被放在你的 home 目录下的一个配置文件中 (~/.vuerc)。你可以通过直接编辑这个文件来调整、添加、删除保存好的 preset