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

async function search({ from, to }) {
	const params = new URLSearchParams();
	params.append("from", from);
	params.append("to", to);

	const res = await fetch(API_URL + "/availability?" + params);

	const data = await res.json();

	console.log(data);
}
</script>

<template>
	<div>
		<TimeSelector @submit="search" />
	</div>
</template>

<style scoped>
div {
	display: grid;
	place-items: center;
	height: 100%;
}
</style>
