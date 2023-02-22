<script setup>
import {
	GoogleAuthProvider,
	signInWithRedirect,
	getAuth,
	getRedirectResult,
} from "firebase/auth";
import { API_URL } from "@/main.js";
import { ref, inject } from "vue";
import BookingCard from "@/components/Room/BookingCard.vue";
import SearchCard from "../components/Search/SearchCard.vue";

const auth = getAuth();

const admin = ref(inject("admin"));

const user = ref(auth.currentUser);

const search = ref({});

const componentKey = ref(0);

const isBlurring = ref(true);

const searchInterval = ref({
	from: new Date(),
	to: new Date(),
});

let previousArgs = {};

async function sendSearch(args) {
	isBlurring.value = false;

	previousArgs = args;
	const params = new URLSearchParams(args);

	const res = await fetch(API_URL + "/availability?" + params, {
		headers: {
			Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
		},
	});

	const data = await res.json();

	search.value = data;

	searchInterval.value.from = new Date(search.value.start);
	searchInterval.value.to = new Date(search.value.end);

	const bookingLengthInIntervals =
		(searchInterval.value.to - searchInterval.value.from) /
		(1000 * 60) /
		15;

	search.value.result = search.value.result.map((room) => {
		const timeslots = Array.from(
			{ length: bookingLengthInIntervals },
			() => false
		);

		room.bookings.forEach((booking) => {
			const bookingStart = new Date(booking.start);
			const bookingEnd = new Date(booking.end);

			const bookingStartIndex = Math.max(
				0,
				Math.floor(
					(bookingStart - searchInterval.value.from) /
						(1000 * 60 * 15)
				)
			);

			const bookingEndIndex = Math.min(
				timeslots.length,
				Math.floor(
					(bookingEnd - searchInterval.value.from) / (1000 * 60 * 15)
				)
			);

			for (let i = bookingStartIndex; i < bookingEndIndex; i++) {
				timeslots[i] = booking;
			}
		});

		room.timeslots = timeslots;

		return room;
	});

	sortSearch();

	componentKey.value++;
}

function sortSearch() {
	search.value.result.sort((a, b) => {
		const statusA =
			a.bookings.length === 0 ? 0 : a.timeslots.every((x) => x) ? 2 : 1;

		const statusB =
			b.bookings.length === 0 ? 0 : b.timeslots.every((x) => x) ? 2 : 1;

		return statusA - statusB;
	});
}

async function bookRoom(room, from, to) {
	const res = await fetch(API_URL + "/bookings", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			room: room,
			from: from.toJSON(),
			to: to.toJSON(),
		}),
	});

	isBlurring.value = false;

	if (res.ok) {
		alert("Room booked!");
	} else {
		alert("Room not booked!");
	}

	sendSearch(previousArgs);
}
</script>

<template>
	<main>
		<SearchCard @search="sendSearch" />

		<div class="search-results">
			<div class="blurrer" :class="{ show: isBlurring }"></div>
			<BookingCard
				v-for="item in search.result"
				:room="item"
				:search-interval="searchInterval"
				@book="bookRoom"
				:key="componentKey"
				@hover="isBlurring = true"
				@leave="isBlurring = false"
			/>
		</div>
	</main>
</template>

<style scoped>
main {
	display: grid;
	grid-template-rows: auto 1fr;
	justify-items: center;
	align-items: start;
}

.search-results {
	position: relative;
	justify-self: stretch;
	align-self: stretch;
	align-items: start;
	padding: 4rem;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
	grid-auto-rows: 10rem;
	gap: 2rem;
}

.blurrer {
	opacity: 0;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	backdrop-filter: blur(2px);
	transition: opacity 0.2s;
	z-index: -1;
}

.show {
	opacity: 1;
	z-index: 1;
}
</style>
