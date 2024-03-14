<template>
  <div class="page">
  <input type="text" 
        :class="['todo-input',{'active':isActive}]" 
        :value="value" 
        v-on="listeners"
        @focus="isActive = true" 
        @blur="isActive = false">
  </div>
</template>

<script>
export default {
  name: 'BaseInputText',
  props: {
    value: {
      type: String,
      require: true,
      default: "请输入内容"
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  computed:{
    listeners(){
      return {
        ...this.$listeners,
        input: event => this.$emit('input',event.target.value)
      }
    }
  }
}
</script>

<style scoped>
.todo-input {
  border-radius: 6px;
  width: 100%;
  line-height: 38px;
  padding:4px 10px;
  border: 0;
  outline: 0;
  background-color: rgba(0, 0, 0, .4);
  box-shadow: 0 0 -4px #222 inset;
  color: #fff;
}
.active {
  box-shadow: 0 0 4px #000;
}
</style>
