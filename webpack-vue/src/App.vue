<template>
  <div id="app">
    <p class="title">hello 单文件vue组件</p>
    <p>vue-loader：https://vue-loader.vuejs.org/zh</p>
    <p>vue-loader将解析文件，提取每个语言模块，如有必要，将它们通过其他加载器进行管道传输，最后将他们组装回ES模块，默认导出为Vue.js组件选项对象</p>
    <h3>vue单文件的组成</h3>
    <p>template: 每个.vue文件一次最多可以包含一个template模块，内容将被提取并床底给vue-template-compiler并预编译为javascript渲染函数，最后注入script部分的导出组件中</p>
    <p>script:每个.vue文件最多可以包含一个块，任何针对js文件的webpack rules都将应用于块中的内容</p>
    <p>style:默认匹配/\.css$/,可以包含多个style模板，可以包含scope或module属性，任何针对.css文件的webpack rules都将应用于style块中的内容</p>
    <p>{{ message }}</p>
    <BaseInput></BaseInput>
  </div>
</template>

<script>
import BaseInput from './components/BaseInput.vue'
export default {
    components:{BaseInput},
    data(){
        return{
            message:"hhello"
        }
    }
}
</script>

<style lang="stylus">
.title
  color: red;
</style>