<script setup>
import { ref } from "vue";
import ScheduleColumn from "./ScheduleColumn.vue";

const props = defineProps({
	room: {
		type: Object,
	},
});

const currentTime = new Date();

// const weekStart = new Date();

// weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

// weekStart.setHours(8, 0, 0, 0);

// const weekEnd = new Date(weekStart);

// weekEnd.setDate(weekEnd.getDate() + 4);

// weekEnd.setHours(18, 45, 0, 0);

// console.log(weekEnd);

const timeslots = ref(getIntervals());

function getIntervals() {
	const intervalsPerDay = 43;

	const dayTimeslots = Array.from({ length: 5 }, (_, i) => {
		let defaultStatus = {
			status: "Available",
		};

		if (currentTime.getDay() > i + 1) {
			defaultStatus.status = "Old";
		}

		const timeslots = Array.from({ length: intervalsPerDay }, () => ({
			...defaultStatus,
		}));

		if (timeslots[0].status === "Old") {
			return timeslots;
		}

		const day = new Date();
		day.setDate(day.getDate() - day.getDay() + i + 1);
		day.setHours(8, 0, 0, 0);

		timeslots.forEach((timeslot, j) => {
			const timeslotEnd = new Date(day);
			timeslotEnd.setMinutes(day.getMinutes() + j * 15 + 15);

			if (timeslotEnd < currentTime) {
				timeslot.status = "Old";
			}
		});

		return timeslots;
	});

	props.room.bookings.forEach((booking) => {
		const bookingStart = new Date(booking.start);
		const bookingEnd = new Date(booking.end);

		const dayIndex = bookingStart.getDay() - 1;

		const dayStart = new Date(bookingStart);
		dayStart.setHours(8, 0, 0, 0);

		const bookingStartIndex = Math.max(
			0,
			Math.floor((bookingStart - dayStart) / (1000 * 60 * 15))
		);

		const bookingEndIndex = Math.min(
			intervalsPerDay,
			Math.floor((bookingEnd - dayStart) / (1000 * 60 * 15))
		);

		if (
			dayTimeslots[dayIndex][bookingStartIndex].status === "Old" &&
			dayTimeslots[dayIndex][bookingEndIndex].status === "Old"
		) {
			return;
		}

		for (let i = bookingStartIndex; i < bookingEndIndex; i++) {
			dayTimeslots[dayIndex][i].status = "Booked";
			dayTimeslots[dayIndex][i].booking = booking;
		}
	});

	return dayTimeslots;
}
</script>

<template>
	<div class="schedule">
		<ScheduleColumn
			v-for="(timeslot, i) in timeslots"
			:key="day"
			:day="i + 1"
			:timeslots="timeslot"
		/>
	</div>
</template>

<style scoped>
.schedule {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	width: 50rem;
	height: 40rem;
}

.schedule-column {
	border: 1px solid #555;
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: 1fr;
}

.schedule-row {
	padding: 1rem;
}

.schedule-row + .schedule-row {
	border-top: 1px solid #555;
}

.schedule-column-header {
	text-align: center;
	font-weight: bold;
}
</style>
