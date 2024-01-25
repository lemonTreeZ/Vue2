<template>
  <div id="app">
    <h2>事务清单</h2>
    <TodoList/>
  </div>
</template>

<script>
import TodoList from './components/TodoList.vue'
export default {
  name: 'App',
  components:{TodoList},
  data() {
    return {

    }
  },
  mounted() {

  }
}
</script>

<style>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  margin: 0 auto;
  max-width: 650px;
  text-align: center;
  padding: 40px;
  border: 1px solid red;
}
body {
  background-color: rgba(109, 195, 201, 0.3);
}
</style>
