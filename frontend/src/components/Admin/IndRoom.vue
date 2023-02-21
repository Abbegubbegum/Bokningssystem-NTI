<script setup>
import { defineProps, ref, inject } from "vue";
import { API_URL } from "@/main.js";
import { getAuth } from "@firebase/auth";

const auth = getAuth();

const props = defineProps(["roomNumber"]);
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
</script>
<template>
  <div>
    <h1 @click="toggleBookings">{{ props.roomNumber }}</h1>
    <div class="bookings" v-if="showBookings">
      <div v-for="booking in bookings">
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
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  height: 3rem;
}
</style>
