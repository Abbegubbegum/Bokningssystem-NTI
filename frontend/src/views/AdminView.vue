<script setup>
import { ref, inject } from "vue";
import router from "../router";
import { API_URL } from "@/main.js";
import { getAuth } from "@firebase/auth";

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

const bookingRes = await fetch(API_URL + "/bookings", {
  headers: {
    Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
  },
  method: "GET",
});

const rooms = await roomRes.json();
const bookings = await bookingRes.json();

let bigRoom = [];

</script>

<template>
  <div>
    <h1 v-for="room in rooms">{{ room.roomNumber }}</h1>
  </div>
</template>

<style scoped></style>
