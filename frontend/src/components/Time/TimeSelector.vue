<script setup>
import { ref } from "vue";
import TimeDropdown from "./TimeDropdown.vue";
import TimeDoubleDropdown from "./TimeDoubleDropdown.vue";
import TimeRollingSelect from "./TimeRollingSelect.vue";
import { API_URL } from "../../main";

const fromTime = ref(null);
const toTime = ref(null);

const emit = defineEmits(["submit"]);

async function submit() {
	const from = fromTime.value.submit();
	const to = toTime.value.submit();

	if (!from || !to) {
		alert("Please select a Time!");
		return;
	}

	const fromHour = parseInt(from.split(":")[0]);
	const fromMinute = parseInt(from.split(":")[1]);

	const toHour = parseInt(to.split(":")[0]);
	const toMinute = parseInt(to.split(":")[1]);

	if (fromHour > toHour) {
		alert("From time must be before to time");
		return;
	}

	if (fromHour === toHour && fromMinute >= toMinute) {
		alert("From time must be before to time");
		return;
	}

	emit("submit", { from, to });
}
</script>

<template>
	<div class="container">
		<div>
			<span>From:</span>
			<TimeDoubleDropdown ref="fromTime" />
		</div>
		<!-- <span class="hyphen">----</span> -->
		<div>
			<span>To:</span>
			<TimeDoubleDropdown ref="toTime" />
		</div>
		<div class="btn-group">
			<button type="button" class="search-btn" @click="submit">
				Search
			</button>
		</div>
	</div>
</template>

<style scoped>
.container {
	min-width: 20rem;
	height: 10rem;
	border: 1px solid #555;
	border-radius: 1.5rem;
	display: grid;
	grid-template-columns: 1fr 1fr;
	padding-top: 1rem;
}

.hyphen {
	font-size: 2rem;
	font-weight: 100;
	letter-spacing: -0.5rem;
}

.btn-group {
	grid-column: 1 / 3;
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
