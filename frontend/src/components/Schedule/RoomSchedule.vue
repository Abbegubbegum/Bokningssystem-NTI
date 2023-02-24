<script setup>
import { computed, ref } from "vue";
import ScheduleColumn from "./ScheduleColumn.vue";

const props = defineProps({
	room: {
		type: Object,
	},
	week: {
		type: Date,
	},
});

const emit = defineEmits(["select"]);

const currentTime = new Date();

// const weekStart = new Date();

// weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

// weekStart.setHours(8, 0, 0, 0);

// const weekEnd = new Date(weekStart);

// weekEnd.setDate(weekEnd.getDate() + 4);

// weekEnd.setHours(18, 45, 0, 0);

// console.log(weekEnd);

const weekStart = computed(() => {
	const day = new Date(props.week);
	day.setDate(day.getDate() - day.getDay() + 1);
	day.setHours(8, 0, 0, 0);
	return day;
});

const intervalsPerDay = ref(43);

const timeslots = ref(getIntervals());

const timeslotRefs = ref([]);

const schedule = ref(null);

function getIntervals() {
	const dayTimeslots = Array.from({ length: 5 }, (_, i) => {
		let defaultStatus = {
			status: "Available",
		};

		if (currentTime.getDate() > weekStart.value.getDate() + i) {
			defaultStatus.status = "Old";
		}

		const timeslots = Array.from({ length: intervalsPerDay.value }, () => ({
			...defaultStatus,
		}));

		if (timeslots[0].status === "Old") {
			return timeslots;
		}

		const day = new Date(weekStart.value);
		day.setDate(day.getDate() + i);

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
			intervalsPerDay.value,
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

function getTime(index) {
	const time = new Date();
	time.setHours(8, 0, 0, 0);
	time.setMinutes(time.getMinutes() + index * 15);

	return time.toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	});
}

function getColumnHeader(dayIndex) {
	const day = new Date();
	day.setDate(day.getDate() - day.getDay() + dayIndex);

	return day.toLocaleDateString(undefined, { weekday: "long" });
}

function handleSelect(day, start, end) {
	timeslotRefs.value.forEach((ref) => {
		if (ref.day !== day) {
			ref.clearSelect();
		}
	});

	emit("select", start, end);
}

// document.addEventListener("mousedown", (e) => {
// 	if (!schedule.value) {
// 		return;
// 	}

// 	if (!schedule.value.contains(e.target)) {
// 		timeslotRefs.value.forEach((ref) => {
// 			ref.clearSelect();
// 		});
// 	}
// });
</script>

<template>
	<div class="schedule" ref="schedule">
		<div class="column-header"></div>
		<div class="column-header" v-for="i in timeslots.length">
			{{ getColumnHeader(i) }}
		</div>

		<div class="time-column">
			<div
				v-for="index in Math.floor(intervalsPerDay / 4) + 1"
				class="time-item"
			>
				{{ getTime((index - 1) * 4) }}
			</div>
		</div>
		<ScheduleColumn
			v-for="(timeslot, i) in timeslots"
			:key="i + 1"
			ref="timeslotRefs"
			:day="i + 1"
			:timeslots="timeslot"
			@select="
				(start, end) => {
					handleSelect(i + 1, start, end);
				}
			"
		/>
	</div>
</template>

<style scoped>
.schedule {
	display: grid;
	grid-template-columns: auto repeat(5, 1fr);
	grid-template-rows: min-content;
	width: 50rem;
	border: 1px solid #555;
}

.column-header {
	border-bottom: 2px solid #555;
	text-align: center;
}

.column-header + .column-header {
	border-left: 1px solid #555;
}

.column-header:nth-child(5) {
	border-right: 1px solid #555;
}

.time-column {
	display: grid;
	grid-template-rows: repeat(10, 4fr) 3fr;
	border: 1px solid #555;
}

.time-item {
	padding: 0 0.5rem;
	font-size: 1.5rem;
	border-top: 3px solid #555;
	font-family: "Inconsolata", monospace;
}

.time-item:nth-child(1) {
	border-top: none !important;
}
</style>
