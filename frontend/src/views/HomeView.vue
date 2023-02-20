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

	componentKey.value++;
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
	<main>
		<SearchCard @search="sendSearch" />

		<div class="search-results">
			<BookingCard
				v-for="item in search.result"
				:room="item"
				:search-interval="{
					from: new Date(search.start),
					to: new Date(search.end),
				}"
				@book="bookRoom"
				:key="componentKey"
			/>
		</div>
	</main>
</template>

<style scoped>
main {
	display: grid;
	grid-template-rows: 15vh 1fr;
	justify-items: center;
	align-items: start;
}
</style>
