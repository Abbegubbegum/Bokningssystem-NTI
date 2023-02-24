<script setup>
import { defineProps, ref, inject } from "vue";
import { API_URL } from "@/main.js";
import { getAuth } from "@firebase/auth";

const auth = getAuth();

const props = defineProps(["roomNumber", "editMode"]);
let showBookings = ref(false);
let hasFetched = false;

let bookings = ref([]);

async function toggleBookings() {
  showBookings.value = !showBookings.value;

  if (!hasFetched) {
    bookings.value = await getBookings(props.roomNumber);
    hasFetched = true;
    console.log(bookings.value);
  }
}

async function getBookings(roomNumber) {
  let bookingRes = await fetch(API_URL + "/bookings/" + roomNumber, {
    headers: {
      Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
    },
    method: "GET",
  });
  return await bookingRes.json();
}

async function deleteBooking(id) {
  if (!confirm("Are you sure you want to delete this booking?")) {
    return;
  }

  let res = await fetch(API_URL + "/bookings/", {
    headers: {
      Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
    method: "DELETE",
  });
}
</script>
<template>
  <div>
    <div class="ind-room">
      <h1 @click="toggleBookings">{{ props.roomNumber }}</h1>
      <div class="bookings" v-if="showBookings">
        <div
          class="ind-booking"
          v-if="bookings.length !== 0"
          v-for="booking in bookings"
        >
          <span>
            {{
              new Date(booking.start).toLocaleDateString(undefined, {
                month: "short",
                day: "2-digit",
                minute: "2-digit",
                hour: "2-digit",
              })
            }}
            -
            {{
              new Date(booking.end).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </span>
          By: {{ booking.booker.name }}

          <button class="delete-button" @click="deleteBooking(booking._id)">
            🗑️
          </button>
        </div>
        <div v-else>No bookings</div>

        <div v-if="props.editMode">
          <button>Add Booking</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
span {
  font-family: "Inconsolata", monospace;
}
h1 {
  cursor: pointer;
  font-size: 1.5rem;
}
.ind-room {
  border: 1px solid black;
  padding: 1rem;
  width: 30%;
  margin: auto auto;
  margin-bottom: 1rem;
}
.ind-booking {
  padding: 1rem;
  margin-bottom: 0.5rem;
}

.ind-booking + .ind-booking {
  border-top: 1px solid black;
}
.delete-button {
  float: right;
  background-color: transparent;
  border: solid 1px black;
  cursor: pointer;
  padding: 0.2rem;
}
</style>
