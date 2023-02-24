<script setup>
import { ref, watchEffect } from "vue";
import RoomSchedule from "@/components/Schedule/RoomSchedule.vue";
import { API_URL } from "@/main.js";
import { getAuth } from "firebase/auth";

const auth = getAuth();

const start = ref(null);
const end = ref(null);
const roomNumber = ref("");

const schedule = ref(null);

function selectBooking(tempStart, tempEnd, room) {
	start.value = tempStart;
	end.value = tempEnd;
	roomNumber.value = room;
}

async function book() {
	if (!start.value || !end.value) {
		return;
	}

	const res = await fetch(API_URL + "/bookings", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			room: roomNumber.value,
			from: start.value,
			to: end.value,
		}),
	});

	if (res.ok) {
		schedule.value.fetchBookings();
		schedule.value.clearSelection();

		alert("Booking created!");
	} else {
		alert("Booking failed!");
	}
}
</script>

<template>
	<div class="main-view">
		<RoomSchedule ref="schedule" @select="selectBooking" />

		<div class="booking-popup" v-if="start && end">
			<div class="popup-label">
				{{
					start
						? start.toLocaleDateString(undefined, {
								month: "short",
								day: "2-digit",
								weekday: "short",
								hour: "2-digit",
								minute: "2-digit",
						  })
						: ""
				}}
				-
				{{
					end
						? end.toLocaleDateString(undefined, {
								weekday: "short",
								hour: "2-digit",
								minute: "2-digit",
						  })
						: ""
				}}
			</div>
			<div class="popup-btn-group">
				<button
					type="button"
					class="cancel-btn"
					@click="clearSelection"
				>
					Cancel
				</button>
				<button type="button" class="book-btn" @click="book">
					Book
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.main-view {
	display: grid;
	grid-template-rows: auto 1fr;
	grid-template-columns: auto 1fr;
	padding-top: 2rem;
	place-items: start;
}

.schedule {
	grid-row: 2;
}

.booking-popup {
	margin: 1rem;
	padding: 1rem;
	border: 1px solid #555;
	border-radius: 1rem;
	min-width: 15rem;
	grid-row: 2;
}

.popup-label {
	font-size: 1.5rem;
	text-align: center;
	font-family: "Inconsolata", monospace;
}

.popup-btn-group {
	display: flex;
	justify-content: space-between;
	padding-top: 1rem;
}

.cancel-btn {
	background-color: #ddd;
	color: black;
	padding: 0.5rem 1rem;
	border-radius: 5px;
	border: none;
	cursor: pointer;
}

.book-btn {
	background-color: #1da1f2;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 5px;
	border: none;
	cursor: pointer;
}

.book-btn:hover:not(.disabled) {
	background-color: #0d8bd2;
}
</style>
