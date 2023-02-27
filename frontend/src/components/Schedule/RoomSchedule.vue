<script setup>
import { computed, ref, watchEffect } from "vue";
import ScheduleColumn from "./ScheduleColumn.vue";
import { API_URL } from "@/main.js";
import { getAuth } from "@firebase/auth";

const auth = getAuth();

const emit = defineEmits(["select"]);

defineExpose({
	clearSelection,
	fetchBookings,
});

const currentTime = new Date();

const roomNumber = ref("");
const rooms = ref([]);
const bookings = ref([]);

const bookingsIsFetched = ref(false);

const intervalsPerDay = ref(43);

const timeslots = ref([]);
const timeslotRefs = ref([]);

const schedule = ref(null);

const week = ref(new Date());
if (week.value > getWeekEnd()) {
	week.value.setDate(week.value.getDate() + 8 - week.value.getDay());
} else {
	week.value.setDate(week.value.getDate() + 1 - week.value.getDay());
}
week.value.setHours(8, 0, 0, 0);

await fetchRooms();

watchEffect(fetchBookings);

function getWeekEnd() {
	const weekEnd = new Date(week.value);
	weekEnd.setDate(weekEnd.getDate() - weekEnd.getDay() + 5);
	weekEnd.setHours(18, 45, 0, 0);

	return weekEnd;
}

function getIntervals() {
	const dayTimeslots = Array.from({ length: 5 }, (_, i) => {
		let defaultStatus = {
			status: "Available",
		};

		const weekDay = new Date(week.value);
		weekDay.setDate(weekDay.getDate() + i);
		weekDay.setHours(18, 45);

		if (currentTime > weekDay) {
			defaultStatus.status = "Old";
		}

		const timeslots = Array.from({ length: intervalsPerDay.value }, () => ({
			...defaultStatus,
		}));

		if (timeslots[0].status === "Old") {
			return timeslots;
		}

		weekDay.setHours(8, 0);

		timeslots.forEach((timeslot, j) => {
			const timeslotEnd = new Date(weekDay);
			timeslotEnd.setMinutes(weekDay.getMinutes() + j * 15 + 15);

			if (timeslotEnd < currentTime) {
				timeslot.status = "Old";
			}
		});

		return timeslots;
	});

	bookings.value.forEach((booking) => {
		const bookingStart = new Date(booking.start);
		const bookingEnd = new Date(booking.end);

		if (bookingEnd < week.value || bookingStart > getWeekEnd()) {
			return;
		}

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

function handleSelect(day, startIndex, endIndex) {
	timeslotRefs.value.forEach((ref) => {
		if (ref.day !== day) {
			ref.clearSelect();
		}
	});

	const dateStart = new Date(week.value);
	dateStart.setDate(dateStart.getDate() + day);
	dateStart.setMinutes(dateStart.getMinutes() + startIndex * 15);

	const dateEnd = new Date(week.value);
	dateEnd.setDate(dateEnd.getDate() + day);
	dateEnd.setMinutes(dateEnd.getMinutes() + endIndex * 15 + 15);

	emit("select", dateStart, dateEnd, roomNumber.value);
}

function clearSelection() {
	timeslotRefs.value.forEach((ref) => {
		ref.clearSelect();
	});

	emit("select", null, null, null);
}

async function fetchRooms() {
	const res = await fetch(API_URL + "/rooms", {
		method: "GET",
		headers: {
			Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
		},
	});

	if (res.ok) {
		const data = await res.json();

		rooms.value = data.map((x) => x.roomNumber);

		roomNumber.value = rooms.value[0];
	}
}

async function fetchBookings() {
	const res = await fetch(API_URL + "/bookings/" + roomNumber.value, {
		method: "GET",
		headers: {
			Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
		},
	});

	if (res.ok) {
		const data = await res.json();
		console.log(data);

		bookings.value = data;
		bookingsIsFetched.value = true;

		timeslots.value = getIntervals();
	}
}

function prevWeek() {
	week.value.setDate(week.value.getDate() - 7);
	timeslots.value = getIntervals();
	clearSelection();
}

function nextWeek() {
	week.value.setDate(week.value.getDate() + 7);
	timeslots.value = getIntervals();
	clearSelection();
}

function currentWeek() {
	week.value = new Date();
	if (week.value > getWeekEnd()) {
		week.value.setDate(week.value.getDate() + 8 - week.value.getDay());
	} else {
		week.value.setDate(week.value.getDate() + 1 - week.value.getDay());
	}
	week.value.setHours(8, 0, 0, 0);

	timeslots.value = getIntervals();
	clearSelection();
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
		<div class="header">
			<div class="week-span">
				{{
					week.toLocaleDateString(undefined, {
						month: "long",
						day: "2-digit",
					})
				}}
				-
				{{
					getWeekEnd().toLocaleDateString(undefined, {
						month: "long",
						day: "2-digit",
					})
				}}
			</div>
			<div class="week-selector">
				<button type="button" class="arrow-btn" @click="prevWeek">
					&lt;
				</button>
				<button
					type="button"
					class="current-week-btn"
					@click="currentWeek"
				>
					Current Week
				</button>
				<button type="button" class="arrow-btn" @click="nextWeek">
					&gt;
				</button>
			</div>
			<div class="room-selector">
				Room:
				<select v-model="roomNumber">
					<option v-for="room in rooms" :value="room" :key="room">
						{{ room }}
					</option>
				</select>
			</div>
		</div>
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
			:key="i"
			ref="timeslotRefs"
			:day="i"
			:timeslots="timeslot"
			@select="
				(start, end) => {
					handleSelect(i, start, end);
				}
			"
		/>
	</div>
</template>

<style scoped>
.schedule {
	display: grid;
	grid-template-columns: auto repeat(5, 1fr);
	grid-template-rows: auto auto;
	width: 50rem;
}

.header {
	grid-column: 1 / 7;
	padding-top: 1rem;
	display: flex;
	justify-content: end;
	border-bottom: 1px solid #555;
}

.week-span {
	margin-right: auto;
	margin-left: 0.5rem;
	font-size: 1.5rem;
}

.arrow-btn {
	padding: 0 0.5rem;
	height: 100%;
	font-weight: bold;
}

.current-week-btn {
	height: 100%;
	line-height: 0;
}

.room-selector {
	font-size: 1.5rem;
}

.room-selector select {
	margin-left: 0.5rem;
	padding: 0 1rem;
	font-size: 1.5rem;
}

.column-header {
	border-bottom: 2px solid #555;
	text-align: center;
}

.column-header {
	border-left: 1px solid #555;
}

.column-header:nth-child(7) {
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
	/* font-family: "Inconsolata", monospace; */
	font-variant-numeric: tabular-nums;
}

.time-item:nth-child(1) {
	border-top: none !important;
}
</style>
