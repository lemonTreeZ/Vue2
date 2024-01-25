<template>
  <!-- <div> -->
    <li class="todo-list--item">
        <span>{{ todo.text }}</span>
        <button class="todo-button--clean" @click="cleanTask(todo.id)">x</button>
    </li>
  <!-- </div> -->
</template>

<script>
export default {
    props:{
        todo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            vaule: ''
        }
    },
    methods:{
        cleanTask(id) {
            this.$emit("remove",id)
        }
    }
}
</script>

<style>
.todo-list--item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    height: 45px;
    margin-bottom: 4px;
    border-radius: 8px;
    font-size: 12px;
    padding: 0 10px;
}
.todo-button--clean {
    width: 40px;
    height: 28px;
    border: 0;
    color: #fff;
    background-color: rgba(0, 0, 0, .3);
    border-radius: 4px;
    cursor: pointer;
}
.todo-button--clean:hover {
    background-color: rgba(0, 0, 0, .6);
}
</style>