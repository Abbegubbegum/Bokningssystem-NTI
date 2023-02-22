<script setup>
import { API_URL } from "@/main.js";
import { RouterView, RouterLink } from "vue-router";
import { provide, ref } from "vue";
import {
	getAuth,
	getRedirectResult,
	signInWithRedirect,
	GoogleAuthProvider,
} from "@firebase/auth";
import router from "@/router";

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

function logout() {
	auth.signOut();
	window.location = "/";
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
				<div class="profile-dropdown">
					<router-link to="/" class="profile-dropdown-item"
						>Book a Room</router-link
					>
					<router-link to="/bookings" class="profile-dropdown-item"
						>My Bookings</router-link
					>
					<router-link
						to="/admin"
						v-if="admin"
						class="profile-dropdown-item"
						>Admin Panel</router-link
					>
					<button
						class="profile-dropdown-item"
						type="button"
						@click="logout"
					>
						Logout
					</button>
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
	position: relative;
	align-items: center;
	justify-content: space-around;
}

.admin-text {
	color: cornflowerblue;
	font-weight: bold;
}

.profile-img {
	width: 3rem;
	aspect-ratio: 1 / 1;
	margin-right: 1rem;
	border-radius: 50%;
	border: 2px solid #222;
}

.profile-dropdown {
	position: absolute;
	display: none;
	top: 100%;
	left: 0;
	grid-auto-flow: row;
	background-color: white;
	border-radius: 0 0 0.5rem 0.5rem;
	border-top: 1px solid #555;
	box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 10px 0px;
	width: 100%;
}

.profile-item:hover .profile-dropdown,
.profile-dropdown:hover {
	display: grid;
}

.profile-dropdown-item {
	padding: 0.5rem;
	text-align: center;
	text-decoration: none;
	background-color: white;
	border: none;
	cursor: pointer;
}

.profile-dropdown-item + .profile-dropdown-item {
	border-top: 1px solid #555;
}

.profile-dropdown-item:hover {
	background-color: #555;
	color: white;
}
</style>
