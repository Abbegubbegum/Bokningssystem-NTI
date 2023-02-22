<script setup>
import { ref, inject } from "vue";
import router from "../router";
import { API_URL } from "@/main.js";
import { getAuth } from "@firebase/auth";
import IndRoom from "../components/Admin/IndRoom.vue";

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

const rooms = await roomRes.json();

let editMode = ref(false);
</script>

<template>
  <div class="room-container">
    <h1>Rooms:</h1>
    <IndRoom v-for="room in rooms" :roomNumber="room.roomNumber" />

    <div><button @click="editMode = !editMode">Edit Rooms</button></div>
  </div>
</template>

<style scoped>
.room-container {
  width: 40%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
}
</style>
