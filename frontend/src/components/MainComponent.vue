<script setup>
import { API_URL } from "@/main.js";
import { RouterView } from "vue-router";
import { provide, ref } from "vue";
import { getAuth, getRedirectResult, signInWithRedirect } from "@firebase/auth";

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

const user = ref(auth.currentUser);

const admin = ref(data.admin);

provide("admin", admin);
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

		<RouterView />
	</div>
</template>

<style scoped>
.content-wrapper {
	display: grid;
	grid-template-rows: 5rem 1fr;
	height: 100%;
	width: 100%;
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
