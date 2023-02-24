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
let roomNumber = ref("");

async function addRoom() {
  let res = await fetch(API_URL + "/rooms", {
    headers: {
      Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      roomNumber: roomNumber.value,
    }),
  });
  if (res.status === 200) {
    alert("Room added");
  } else {
    alert("Room not added");
  }
  //Fixa till att endast ladda om vue component
  location.reload();
}

async function deleteRoom(roomNumber) {
  let res = await fetch(API_URL + "/rooms", {
    headers: {
      Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
      "Content-Type": "application/json",
    },
    method: "DELETE",
    body: JSON.stringify({
      roomNumber: roomNumber,
    }),
  });
  if (res.status === 200) {
    alert("Room deleted");
  } else {
    alert("Room not deleted");
  }
  //Fixa till att endast ladda om vue component
  location.reload();
}
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
    <div class="room-container" v-if="display === 'Rooms'">
      <div v-for="room in rooms">
        <div class="ind-room">
          <span>{{ room.roomNumber }}</span>
          <button @click="deleteRoom(room.roomNumber)">Delete</button>
        </div>
      </div>
      <div class="add-room">
        <h2>Add Room:</h2>
        <form @submit="addRoom">
          <input type="text" v-model="roomNumber" />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
    <div class="bookings-container" v-if="display === 'Bookings'">
      <div v-for="room in rooms">
        <IndRoom :room-number="room.roomNumber" />
      </div>
    </div>
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
.ind-room {
  display: grid;
  grid-template-columns: 1fr 10%;
  border: 1px solid black;
  padding: 1rem;
  width: 30%;
  margin: auto auto;
  margin-bottom: 1rem;
}
.ind-room span {
  font-size: 1.5rem;
}
.room-container {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  margin-top: 0.2rem;
}
.add-room {
  width: 30%;
  margin: auto auto;
  text-align: center;
}
.bookings-container {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  margin-top: 0.2rem;
}
</style>
