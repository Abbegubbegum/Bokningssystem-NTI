<script setup>
import { ref, computed, watch } from "vue";
const { room, searchInterval } = defineProps({
	room: {
		type: Object,
	},
	searchInterval: {
		type: Object,
	},
});

const emits = defineEmits(["book"]);

const timeslots = ref([]);

const selectedTimeslots = ref([]);

const status = computed(() => {
	if (room.bookings.length === 0) {
		return "Available";
	}

	const bookingLengthInIntervals =
		(searchInterval.to - searchInterval.from) / (1000 * 60) / 15;

	timeslots.value = Array.from(
		{ length: bookingLengthInIntervals },
		() => false
	);

	room.bookings.forEach((booking) => {
		const bookingStart = new Date(booking.start);
		const bookingEnd = new Date(booking.end);

		const bookingStartIndex = Math.max(
			0,
			Math.floor((bookingStart - searchInterval.from) / (1000 * 60 * 15))
		);

		const bookingEndIndex = Math.min(
			timeslots.value.length,
			Math.floor((bookingEnd - searchInterval.from) / (1000 * 60 * 15))
		);

		for (let i = bookingStartIndex; i < bookingEndIndex; i++) {
			timeslots.value[i] = booking;
		}
	});

	if (timeslots.value.every((slot) => slot)) {
		return "Unavailable";
	} else {
		return "Partially Available";
	}
});

const statusClassName = computed(() => status.value.replace(" ", "-"));

const buttonLabel = computed(() => {
	return status.value === "Available"
		? "Book"
		: status.value === "Partially Available"
		? selectedATimeslot.value
			? "Book Selected"
			: "Please select a time to Book"
		: "Booked";
});

const selectedATimeslot = computed(() => {
	return selectedTimeslots.value.length > 0;
});

const bookIsDisabled = computed(() => {
	return (
		status.value === "Unavailable" ||
		(status.value === "Partially Available" && !selectedATimeslot.value)
	);
});

const fromLabel = computed(() => {
	return (
		searchInterval.from.getHours().toString().padStart(2, "0") +
		":" +
		searchInterval.from.getMinutes().toString().padStart(2, "0")
	);
});

const toLabel = computed(() => {
	return (
		searchInterval.to.getHours().toString().padStart(2, "0") +
		":" +
		searchInterval.to.getMinutes().toString().padStart(2, "0")
	);
});

function bookRoom() {
	if (status.value === "Available") {
		emits("book", room.room, searchInterval.from, searchInterval.to);
	} else if (status.value === "Partially Available") {
		if (!selectedATimeslot.value) {
			return;
		}

		selectedTimeslots.value.sort((a, b) => a - b);

		//Check if selected timeslots are in sequence
		for (let i = 0; i < selectedTimeslots.value.length - 1; i++) {
			if (
				selectedTimeslots.value[i] + 1 !==
				selectedTimeslots.value[i + 1]
			) {
				alert("Please select timeslots in sequence");
				return;
			}
		}

		const from = new Date(searchInterval.from);

		from.setMinutes(from.getMinutes() + selectedTimeslots.value[0] * 15);

		const to = new Date(searchInterval.from);

		to.setMinutes(
			to.getMinutes() +
				(selectedTimeslots.value[selectedTimeslots.value.length - 1] +
					1) *
					15
		);

		emits("book", room.room, from, to);
	} else {
		alert("Room is unavailable");
	}
}

function clickTimeslot(index) {
	if (timeslots.value[index]) {
		return;
	}

	if (selectedTimeslots.value.includes(index)) {
		selectedTimeslots.value = selectedTimeslots.value.filter(
			(i) => i !== index
		);
		return;
	}

	selectedTimeslots.value.push(index);
}
</script>

<template>
	<div
		class="item-container"
		:class="{ 'show-info': status !== 'Available' }"
	>
		<div>
			<div class="heading">Room: {{ room.room }}</div>
			<span class="status" :class="[statusClassName]">
				{{ status }}
			</span>
		</div>
		<div class="btn-group">
			<button
				type="button"
				class="book-btn"
				:class="{
					disabled: bookIsDisabled,
				}"
				:disabled="bookIsDisabled"
				@click="bookRoom"
			>
				{{ buttonLabel }}
			</button>
		</div>
		<div class="icon-footer">
			<i
				class="bx bx-chevron-down arrow-icon"
				:class="{ rotate: showDropdown }"
			></i>
		</div>
		<div class="extra-info">
			<div class="timeline">
				<div class="timeline-labels">
					<div>
						{{ fromLabel }}
					</div>
					<div>
						{{ toLabel }}
					</div>
				</div>
				<div class="timeline-bar">
					<div
						v-for="(timeslot, i) in timeslots"
						class="timeline-slot"
						:class="{
							booked: timeslot,
							selected: selectedTimeslots.includes(i),
						}"
						@click="clickTimeslot(i)"
					>
						<div class="booking-tooltip">
							<p>Booked by:</p>
							{{ timeslot ? timeslot.booker.name : "" }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.item-container {
	min-width: 25rem;
	padding: 1rem;
	border: 1px solid #555;
	border-radius: 10px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	transition: 0.2s ease;
}

.heading {
	font-size: 1.5rem;
	font-weight: 500;
}

.status {
	font-weight: 500;
}

.Available {
	color: green;
}

.Partially-Available {
	color: orange;
}

.Unavailable {
	color: red;
}

.btn-group {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.book-btn {
	background-color: #1da1f2;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 5px;
	border: none;
	cursor: pointer;
}

.book-btn:hover:not(.disabled) {
	background-color: #0d8bd2;
}

.disabled {
	background-color: #bbb;
	cursor: not-allowed;
}

.icon-footer {
	grid-column: 1 / 3;
	display: none;
	justify-content: flex-end;
	align-items: center;
}

.show-info .icon-footer {
	display: flex;
}

.arrow-icon {
	font-size: 1.5rem;

	transition: 0.2s ease;
}

.extra-info {
	grid-column: 1 / 3;
	display: flex;
	justify-content: center;
	align-items: start;
	height: 0;
	overflow: hidden;
	transition: 0.2s ease;
}

.timeline-labels {
	display: flex;
	justify-content: space-between;
}

.timeline-bar {
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: 1fr;
	height: 1rem;
	width: 15rem;
	outline: 1px solid #555;
}

.timeline-slot + .timeline-slot {
	border-left: 1px solid #555;
}

.booked {
	background-color: red;
}

.selected {
	background-color: greenyellow;
}

.booking-tooltip {
	display: none;
	position: fixed;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	background-color: #555;
	color: white;
	padding: 0.5rem;
	border-radius: 5px;
	max-width: 20ch;
}

.booking-tooltip p {
	text-align: center;
	color: white;
}

.booked:hover .booking-tooltip {
	display: block;
}

.show-info:hover {
	transform: scale(1.1);
}

.show-info:hover .arrow-icon {
	transform: rotate(180deg);
}

.show-info:hover .extra-info {
	height: 100px;
}
</style>
