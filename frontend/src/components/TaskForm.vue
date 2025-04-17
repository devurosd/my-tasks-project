<script setup lang="ts">
import { ref } from 'vue';

const newTask = ref("");
const error = ref("");

const emit = defineEmits<{
    addTask: [newTask: String]
}>();

function formSubmit(){
  if(newTask.value.trim()){
    emit("addTask", newTask.value.trim());
    newTask.value = "";
  }else{
    error.value = "Task can't be empty!";
  }
  
}
</script>

<template>
    <form @submit.prevent="formSubmit">
      <label for="newTask">New Task
        <input 
            v-model="newTask" 
            name="newTask" 
            required 
            :aria-invalid="!!error || undefined"
            @input = "error = ''"
        />
        <small v-if="error" id="invalid-helper">
        {{ error }}
      </small>
      </label>
      
      <div class="button-container">
        <button>Add</button>
      </div>
    </form>
</template>

<style scoped>

.button-container {
  display: flex;
  justify-content: end;
  
}

</style>