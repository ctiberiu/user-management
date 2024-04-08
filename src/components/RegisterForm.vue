<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="registerUser">
      <div>
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" v-model="formData.firstName" required>
      </div>
      <div>
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" v-model="formData.lastName" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="formData.email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="formData.password" required>
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const formData = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });

    const registerUser = () => {
      console.log('Registering user:', formData.value);
      // Here you would typically make an HTTP request to your backend API to register the user
      // Upon successful registration, you may redirect the user to the login page or perform other actions
    };

    return {
      formData,
      registerUser
    };
  }
});
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
