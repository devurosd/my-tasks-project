<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import axios from './axios'; // Importovanje Axios instance
import TaskForm from './components/TaskForm.vue';
import TaskList from './components/TaskList.vue';
import FilterButton from './components/FilterButton.vue';
import type { Task, TaskFilter } from './types';

const message = ref("Tasks");
const tasksList = ref<Task[]>([]);

const totalDone = computed(() => tasksList.value.reduce(
  (total, task) => task.done ? total + 1 : total, 0
));

const filter = ref<TaskFilter>("all");

const filteredTasks = computed(() => {
  switch (filter.value) {
    case "all":
      return tasksList.value;
    case "done":
      return tasksList.value.filter((t) => t.done);
    case "todo":
      return tasksList.value.filter((t) => !t.done);
  }
  return tasksList.value;
});

async function loadTasks() {
  try {
    const response = await axios.get('tasks'); // API route
    tasksList.value = response.data;
  } catch (error) {
    console.error("There was an error fetching tasks:", error);
  }
}

async function addTask(newTask: string) {
  try {
    const response = await axios.post('tasks', { title: newTask });
    tasksList.value.push(response.data);
  } catch (error) {
    console.error("There was an error adding the task:", error);
  }
}

async function removeTask(id: string) {
  try {
    await axios.delete(`tasks/${id}`); // API route
    tasksList.value = tasksList.value.filter((t) => t.id !== id);
  } catch (error) {
    console.error("There was an error removing the task:", error);
  }
}

function checkDone(id: String){
  const task = tasksList.value.find((t)=> t.id === id);

  if(task){
    task.done = !task.done;
  }
}

function setFilter(value: TaskFilter) {
  filter.value = value;
}

onMounted(() => {
  loadTasks(); // Load tasks after component
});
</script>

<template>
  <main>
    <h1>{{ message }}</h1>
    <TaskForm @add-task="addTask"/>
    <h3 v-if="tasksList.length == 0">There are no tasks. Add one to get started :)</h3>
    <h3 v-else-if="tasksList.length == 1">There is {{ tasksList.length }} task. ({{totalDone}}/{{ tasksList.length }} completed)</h3>
    <h3 v-else>There are {{ tasksList.length }} tasks. ({{totalDone}}/{{ tasksList.length }} completed)</h3>
    
    <div v-if="tasksList.length" class="button-container">
      <FilterButton :currentFilter="filter" filter="all" @set-filter="setFilter"/>
      <FilterButton :currentFilter="filter" filter="todo" @set-filter="setFilter"/>
      <FilterButton :currentFilter="filter" filter="done" @set-filter="setFilter"/>
    </div>
    <TaskList :tasks="filteredTasks" @check-done="checkDone" @remove-task="removeTask"/>
  </main>
</template>

<style scoped>
main {
  max-width: 800px;
  margin: 1rem auto;
}

.button-container {
  display: flex;
  justify-content: end;
  gap: 0.5rem;
}
</style>
