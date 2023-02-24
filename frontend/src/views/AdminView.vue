<script setup>
import { ref, inject } from "vue";
import router from "../router";
import { API_URL } from "@/main.js";
import { getAuth } from "@firebase/auth";
import IndRoom from "../components/Admin/IndRoom.vue";
import IndUser from "../components/Admin/IndUser.vue";

const admin = ref(inject("admin"));
if (!admin.value) {
  alert("You are not a admin");
  router.push("/");
}

const auth = getAuth();

const roomRes = await fetch(API_URL + "/rooms", {
  headers: {
    Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
  },
  method: "GET",
});

const usersRes = await fetch(API_URL + "/users", {
  headers: {
    Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
  },
  method: "GET",
});

const users = await usersRes.json();

const rooms = await roomRes.json();
let display = ref("Users");
</script>

<template>
  <div>
    <div class="admin-nav-container">
      <div class="admin-nav-bar">
        <div @click="display = 'Users'" class="admin-nav-tab">
          <h1>Users</h1>
        </div>
        <div @click="display = 'Rooms'" class="admin-nav-tab">
          <h1>Rooms</h1>
        </div>
        <div @click="display = 'Bookings'" class="admin-nav-tab">
          <h1>Bookings</h1>
        </div>
      </div>
    </div>
    <div class="user-container" v-if="display === 'Users'">
      <div>
        <div v-for="user in users" :key="user.id">
          <IndUser :user="user" />
        </div>
      </div>
    </div>
    <div class="user-container" v-if="display === 'Rooms'">Rooms</div>
    <div class="user-container" v-if="display === 'Bookings'">Bookings</div>
  </div>
</template>

<style scoped>
.admin-nav-bar {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  width: 100%;
  margin-top: 0.2rem;
}
.admin-nav-tab {
  margin: 0.5rem;
  min-width: 5rem;
  width: 100%;
  font-size: 1.5rem;
  background-color: rgba(201, 201, 201, 0.377);
  padding: 0.2rem;
  text-align: center;
  border: 1px solid black;
}
.user-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  width: 100%;
  margin-top: 0.2rem;
}
</style>
