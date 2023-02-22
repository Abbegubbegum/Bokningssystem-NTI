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

const columnHeader = ref(
	day.toLocaleDateString(undefined, { weekday: "long" })
);
</script>

<template>
	<div class="schedule-column">
		<div class="schedule-column-item column-header">
			{{ columnHeader }}
		</div>
		<div
			v-for="(timeslot, i) in props.timeslots"
			class="schedule-column-item"
			:class="{ hourStart: i % 4 === 0, [timeslot.status]: true }"
		></div>
	</div>
</template>

<style scoped>
.schedule-column {
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: 1fr;
}

.schedule-column-item + .schedule-column-item:not(.Booked):not(.Old),
.schedule-column-item:not(.Booked):not(.Old) + .schedule-column-item {
	border-top: 1px solid #555;
}

.hourStart:not(.Booked):not(.Old) {
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
</style>
