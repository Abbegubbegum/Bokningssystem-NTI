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
</script>

<template>
  <div>
    <IndRoom v-for="room in rooms" :roomNumber="room.roomNumber" />
  </div>
</template>

<style scoped></style>
