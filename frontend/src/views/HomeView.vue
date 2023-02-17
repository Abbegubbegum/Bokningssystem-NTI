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

async function sendSearch(args) {
	const params = new URLSearchParams(args);

	const res = await fetch(API_URL + "/availability?" + params, {
		headers: {
			Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
		},
	});

	const data = await res.json();

	console.log(data);

	search.value = data;
}

async function bookRoom(room, from, to) {
	const res = await fetch(API_URL + "/booking", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
		},
		body: JSON.stringify({
			room: room,
			from: from.toString(),
			to: to.toString(),
		}),
	});

	if (res.ok) {
		alert("Room booked!");
	} else {
		alert("Room not booked!");
	}
}
</script>

<template>
	<nav>
		<div class="nav-item">
			<img :src="user.photoURL" class="profile-img" />
			{{ user.displayName }}
		</div>
	</nav>
	<main>
		<TimeSelector @search="sendSearch" />

		<div class="search-results">
			<BookingCard
				v-for="item in search.result"
				:room="item"
				:search-interval="{
					from: new Date(search.start),
					to: new Date(search.end),
				}"
				@book="bookRoom"
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

nav {
	display: flex;
	justify-content: end;
	border: 1px solid #555;
}

.nav-item {
	height: 100%;
	padding: 0.5rem;
	border-left: 1px solid #555;
}
</style>
