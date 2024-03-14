<template>
  <div class="todo-list">
    <BaseInputText v-model="newTodoText" @keydown.enter="addTodo"/>
    <h2 class="todo-list-title">任务清单</h2>
    <ul class="todo-list--ul">
        <TodoListItemVue v-for="(item,index) in todoTask" :key="index" :todo="item" @remove="removeTask"/>
    </ul>
  </div>
</template>

<script>
import TodoListItemVue from './TodoListItem.vue'
import BaseInputText from './BaseInputText.vue'
let taskIndex = 1
export default {
    name: 'TodoList',
    components:{TodoListItemVue,BaseInputText},
    data() {
        return {
            newTodoText:"",
            todoTask: [
                {
                    id: taskIndex++,
                    text: '任务一'
                },
                {
                    id: taskIndex++,
                    text: '任务二'
                },
                {
                    id: taskIndex++,
                    text: '任务三'
                },
            ]
        }
    },
    methods: {
        addTodo() {
            const inputText = this.newTodoText.trim()
            if(inputText) {
                this.todoTask.push({
                    id: taskIndex++,
                    text: inputText
                })
                this.newTodoText = ''
            }
        },
        removeTask(todoId) {
            // this.todoTask = this.todoTask.filter(todo => {
            //     return todo.id !== todoId
            // })
            //splice
            let indexId = this.todoTask.findIndex(todo => {
                return todo.id === todoId
            })
            this.todoTask.splice(indexId,1)
        }
    }
}
</script>

<style>
.todo-list {
    padding: 8px;
    margin-top: 40px;
}
.todo-list-title{
    padding: 4px;
    font-size: 18px;
    font-weight: 700;
    text-align: left;
    color: rgb(131, 9, 9)
}
ul.todo-list--ul {
    list-style: none;
    text-align: left;
    padding-left: 8px;
}

</style>