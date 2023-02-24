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

defineExpose({
	clearSelect,
	day: props.day,
});

const emit = defineEmits(["select"]);

const startSelectionIndex = ref(null);
const endSelectionIndex = ref(null);

let mouseIsDown = false;
let isDrag = false;
let hasClicked = false;

document.addEventListener("mouseup", () => {
	if (isDrag !== undefined) {
		hasClicked = !isDrag;
		isDrag = false;
	}
	mouseIsDown = false;
});

function selectTime(i) {
	mouseIsDown = true;
	if (
		startSelectionIndex.value &&
		startSelectionIndex.value === endSelectionIndex.value &&
		hasClicked
	) {
		setEndSelectionIndex(i);
		hasClicked = false;
		return;
	}

	startSelectionIndex.value = i;
	endSelectionIndex.value = i;
	sendSelection();
}

function hoverTimeslot(i) {
	if (startSelectionIndex.value !== null && mouseIsDown) {
		hasClicked = false;
		isDrag = true;
		setEndSelectionIndex(i);
	}
}

function setEndSelectionIndex(index) {
	for (
		let i = Math.min(index, startSelectionIndex.value);
		i < Math.max(index, startSelectionIndex.value);
		i++
	) {
		if (props.timeslots[i].status !== "Available") {
			return;
		}
	}
	endSelectionIndex.value = index;
	sendSelection();
}

function sendSelection() {
	emit(
		"select",
		Math.min(startSelectionIndex.value, endSelectionIndex.value),
		Math.max(endSelectionIndex.value, startSelectionIndex.value)
	);
}

function clearSelect() {
	startSelectionIndex.value = null;
	endSelectionIndex.value = null;
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
						selectTime(i);
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
			@click="
				(e) => {
					if (timeslot.status === 'Available') {
						// selectTime(i);
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

.schedule-column-item:not(.Booked):not(.Old) {
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
