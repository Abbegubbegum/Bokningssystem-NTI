<script setup>
import { ref } from "vue";
const props = defineProps({
	timeslots: {
		type: Array,
	},
	day: {
		type: Number,
	},
});

const day = new Date();
day.setDate(new Date().getDate() - new Date().getDay() + props.day);

const startSelectionIndex = ref(null);
const endSelectionIndex = ref(null);

let isDragging = false;

document.addEventListener("mouseup", () => {
	isDragging = false;
});

function selectTime(timeslot, i) {
	console.log("selectTime", timeslot, i);
	startSelectionIndex.value = i;
	endSelectionIndex.value = i;
	isDragging = true;
}

function hoverTimeslot(i) {
	if (startSelectionIndex.value !== null && isDragging) {
		endSelectionIndex.value = i;
	}
}
</script>

<template>
	<div class="schedule-column">
		<div
			v-for="(timeslot, i) in props.timeslots"
			class="schedule-column-item"
			:class="{
				[timeslot.status]: true,
				hourStart: i % 4 === 0,
				beginningBooking:
					timeslot.status === 'Booked' &&
					props.timeslots[i - 1]?.status !== 'Booked',
				endBooking:
					timeslot.status === 'Booked' &&
					props.timeslots[i + 1]?.status !== 'Booked',
				selected:
					startSelectionIndex &&
					endSelectionIndex &&
					i >= Math.min(startSelectionIndex, endSelectionIndex) &&
					i <= Math.max(startSelectionIndex, endSelectionIndex),
			}"
			@mousedown="
				(e) => {
					if (timeslot.status === 'Available') {
						selectTime(timeslot, i);
					}
				}
			"
			@mouseenter="
				(e) => {
					if (timeslot.status === 'Available') {
						hoverTimeslot(i);
					}
				}
			"
		></div>
	</div>
</template>

<style scoped>
.schedule-column {
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: 20px;
	border: 1px solid #555;
}

.schedule-column-item:not(.Booked):not(.Old):not(.selected) {
	cursor: pointer !important;
}

.schedule-column-item:nth-child(1) {
	border: none;
}

.schedule-column-item + .schedule-column-item:not(.Booked):not(.Old),
.schedule-column-item:not(.Booked):not(.Old) + .schedule-column-item {
	border-top: 1px solid #555;
}

.schedule-column-item:not(.Booked):not(.Old):not(.selected):hover {
	background-color: #ddd;
}

.schedule-column-item + .hourStart:not(.Booked):not(.Old) {
	border-top: 3px solid #555 !important;
}

.column-header {
	font-weight: bold;
	text-align: center;
}

.Old {
	background-color: #aaa;
}

.Booked {
	background-color: red;
}

.beginningBooking {
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
}

.endBooking {
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
}

.selected {
	background-color: greenyellow;
}
</style>
