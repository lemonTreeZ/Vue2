<template>
  <div id="app">
    <p>hello 单文件vue组件</p>
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

<style>

</style>