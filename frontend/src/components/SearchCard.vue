<script setup>
import { ref } from "vue";
import TimeSelector from "./Time/TimeSelector.vue";

const timeSelector = ref(null);

const emit = defineEmits(["search"]);

function submit() {
	const selectedTime = timeSelector.value.getTime();

	console.log(selectedTime);

	if (!selectedTime) return;

	const to = parseTime(selectedTime.to).toString();
	const from = parseTime(selectedTime.from).toString();

	emit("search", { from, to });
}

function parseTime(time, date = null) {
	const newDate = new Date(Date.now());

	newDate.setHours(time.hour, time.minute, 0, 0);

	return newDate;
}
</script>

<template>
	<div class="search-card">
		<TimeSelector ref="timeSelector" />
		<div class="btn-group">
			<button type="button" class="search-btn" @click="submit">
				Search
			</button>
		</div>
	</div>
</template>

<style scoped>
.search-card {
	width: 20rem;
	height: 10rem;
	border: 1px solid #555;
	border-radius: 1.5rem;
	display: grid;
	grid-template-rows: 1fr 1fr;
	place-items: center;
	padding-top: 1rem;
}

.search-btn {
	background-color: transparent;
	border: 1px solid #555;
	border-radius: 1rem;
	padding: 0.5rem 1rem;
	cursor: pointer;
}

.search-btn:hover {
	background-color: #555;
	color: white;
}
</style>
