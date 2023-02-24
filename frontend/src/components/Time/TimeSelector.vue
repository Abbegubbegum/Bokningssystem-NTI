<script setup>
import { ref } from "vue";
import TimeDropdown from "./Old/TimeDropdown.vue";
import TimeDoubleDropdown from "./Old/TimeDoubleDropdown.vue";
import TimeRollingSelect from "./RollingFields/TimeRollingSelect.vue";

defineExpose({ getTime });

const fromTimeDefault = new Date();
const toTimeDefault = new Date();
const day = ref(new Date());

if (fromTimeDefault.getHours() < 8) {
	fromTimeDefault.setHours(8);
	toTimeDefault.setHours(8);
}

if (toTimeDefault.getHours() > 18) {
	fromTimeDefault.setHours(18);
	toTimeDefault.setHours(18);
	day.value.setDate(day.value.getDate() + 1);
}

toTimeDefault.setMinutes(toTimeDefault.getMinutes() + 15);

const fromTime = ref(null);
const toTime = ref(null);

function getTime() {
	const from = fromTime.value.submit();
	const to = toTime.value.submit();

	if (!from || !to) {
		alert("Please select a Time!");
		return undefined;
	}

	if (from.hour > to.hour) {
		alert("From time must be before to time");
		return undefined;
	}

	if (from.hour === to.hour && from.minute >= to.minute) {
		alert("From time must be before to time");
		return undefined;
	}

	return { from: parseTime(from, day.value), to: parseTime(to, day.value) };
}

function parseTime(time, day) {
	const newDate = new Date(day);

	newDate.setHours(time.hour, time.minute, 0, 0);

	return newDate;
}
</script>

<template>
	<div class="time-selector">
		<div class="date-container">
			<input
				type="date"
				@input="day = $event.target.valueAsDate"
				:value="day.toJSON().slice(0, 10)"
			/>
		</div>
		<div class="time-container">
			<span>From:</span>
			<TimeRollingSelect
				ref="fromTime"
				:default="fromTimeDefault"
				:day="day"
				:key="day.toJSON().slice(0, 10)"
			/>
		</div>
		<!-- <span class="hyphen">----</span> -->
		<div class="time-container">
			<span>To:</span>
			<TimeRollingSelect
				ref="toTime"
				:default="toTimeDefault"
				:day="day"
				:key="day.toJSON().slice(0, 10)"
			/>
		</div>
	</div>
</template>

<style scoped>
.time-selector {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: auto 1fr;
	gap: 1rem;
	width: 100%;
}

.date-container {
	grid-column: 1 / 3;
	padding-left: 1rem;
}

.time-container {
	justify-self: end;
}
</style>
