<script setup>
import { ref } from "vue";
import TimeSelector from "./Time/TimeSelector.vue";

const timeSelector = ref(null);

const emit = defineEmits(["search"]);

function submit() {
	const selectedTime = timeSelector.value.getTime();

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
			<button type="button" class="advanced-btn">
				Advanced Search
				<img src="@/assets/icons/slider.svg" class="sliders-icon" />
			</button>
			<button type="button" class="search-btn" @click="submit">
				Search
			</button>
		</div>
	</div>
</template>

<style scoped>
.search-card {
	width: 30rem;
	border: 1px solid #555;
	border-radius: 3rem;
	display: grid;
	grid-template-columns: 1fr 1fr;
	place-items: center;
	padding: 1rem 0;
	box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 10px 0px;
}

.btn-group {
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;
}

.advanced-btn {
	background-color: transparent;
	border: none;
	font-size: 0.9rem;
	text-align: end;
	width: 6rem;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.sliders-icon {
	width: 2rem;
	margin-left: 1rem;
}

.search-btn {
	background-color: transparent;
	border: 1px solid #555;
	border-radius: 2rem;
	padding: 0.5rem 1rem;
	cursor: pointer;
}

.search-btn:hover {
	background-color: #555;
	color: white;
}
</style>
