<script setup>
import {
	GoogleAuthProvider,
	signInWithRedirect,
	getAuth,
	getRedirectResult,
} from "firebase/auth";
import { API_URL } from "@/main.js";
import { ref } from "vue";
import BookingCard from "@/components/Room/BookingCard.vue";
import SearchCard from "../components/Search/SearchCard.vue";

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

const data = await res.json();

const admin = ref(data.admin);

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
	<div class="content-wrapper">
		<nav>
			<div class="nav-item profile-item">
				<img :src="user.photoURL" class="profile-img" />
				<div>
					<p>
						{{ user.displayName }}
					</p>
					<p class="admin-text">
						{{ admin ? "Admin" : "" }}
					</p>
				</div>
			</div>
		</nav>
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
	</div>
</template>

<style scoped>
.content-wrapper {
	display: grid;
	grid-template-rows: 8vh 1fr;
	height: 100%;
	width: 100%;
}

main {
	display: grid;
	grid-template-rows: 15vh 1fr;
	justify-items: center;
	align-items: start;
}

nav {
	display: flex;
	justify-content: end;
	border-bottom: 1px solid #555;
}

.nav-item {
	height: 100%;
	padding: 0.5rem;
	border-left: 1px solid #555;
}

.profile-item {
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 12rem;
}

.admin-text {
	color: cornflowerblue;
	font-weight: bold;
}

.profile-img {
	width: 3rem;
	aspect-ratio: 1 / 1;
	border-radius: 50%;
	border: 2px solid #222;
}
</style>
