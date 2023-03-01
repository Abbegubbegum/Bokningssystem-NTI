<script setup>
import TimeView from "./Home/TimeView.vue";
import RoomView from "./Home/RoomView.vue";
import { ref } from "vue";

const timeIsSelected = ref(
	localStorage.getItem("timeIsSelected") === "false" ? false : true
);

function setTimeIsSelected(val) {
	timeIsSelected.value = val;
	localStorage.setItem("timeIsSelected", val);
}
</script>

<template>
	<div class="main-container">
		<div class="search-nav">
			<button
				type="button"
				:class="{ 'search-btn-selected': timeIsSelected }"
				@click="setTimeIsSelected(true)"
			>
				Time
			</button>
			<button
				type="button"
				:class="{ 'search-btn-selected': !timeIsSelected }"
				@click="setTimeIsSelected(false)"
			>
				Room
			</button>
		</div>

		<TimeView v-if="timeIsSelected" />
		<RoomView v-else />
	</div>
</template>

<style scoped>
.main-container {
	display: grid;
	grid-template-rows: auto 1fr;
}

.search-nav {
	justify-self: center;
	display: flex;
	justify-content: space-around;
	gap: 5rem;
	width: 80%;
	margin-top: 1rem;
}

.search-nav button {
	border: none;
	border-radius: 0.5rem;
	background-color: #555;
	color: #fff;
	font-size: 1.5rem;
	padding: 0.5rem;
	width: 100%;
	cursor: pointer;
	transition: background-color 100ms ease;
}

.search-nav button:hover:not(.search-btn-selected) {
	background-color: #777;
}

.search-btn-selected {
	background-color: #1da1f2 !important;
}
</style>
