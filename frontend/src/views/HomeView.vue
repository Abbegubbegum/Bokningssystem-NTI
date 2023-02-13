<script setup>
import {
	GoogleAuthProvider,
	signInWithRedirect,
	getAuth,
	getRedirectResult,
} from "firebase/auth";
import { API_URL } from "@/main.js";
import { ref } from "vue";
import TimeSelector from "@/components/Time/TimeSelector.vue";
import BookingCard from "@/components/Room/BookingCard.vue";

const auth = getAuth();

await getRedirectResult(auth);

if (!auth.currentUser) {
	signInWithRedirect(auth, new GoogleAuthProvider());
}

const token = await auth.currentUser.getIdToken();

const res = await fetch(API_URL + "/users/login", {
	method: "POST",
	headers: {
		Authorization: "Bearer " + token,
	},
});

if (!res.ok) {
	console.log("error");
	signInWithRedirect(auth, new GoogleAuthProvider());
}

const user = ref(auth.currentUser);

const search = ref({});

async function sendSearch({ from, to }) {
	const fromDate = parseTime(from);
	const toDate = parseTime(to);

	const params = new URLSearchParams();
	params.append("from", fromDate.toString());
	params.append("to", toDate.toString());

	const res = await fetch(API_URL + "/availability?" + params, {
		headers: {
			Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
		},
	});

	const data = await res.json();

	console.log(data);

	search.value = data;
}

function parseTime(time, date = null) {
	const newDate = new Date(Date.now());

	newDate.setHours(time.hour, time.minute, 0, 0);

	return newDate;
}
</script>

<template>
	<main>
		<TimeSelector @submit="sendSearch" />

		<div class="search-results">
			<BookingCard
				v-for="item in search.result"
				:room="item"
				:search-interval="{
					from: new Date(search.start),
					to: new Date(search.end),
				}"
			/>
		</div>
	</main>
</template>

<style scoped>
main {
	display: grid;
	grid-template-rows: 30vh 1fr;
	place-items: center;
	height: 100%;
}
</style>
