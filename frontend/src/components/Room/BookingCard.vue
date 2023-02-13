<script setup>
import { ref, computed } from "vue";
const { room, searchInterval } = defineProps({
	room: {
		type: Object,
		required: true,
	},
	searchInterval: {
		type: Object,
		required: true,
	},
});

const emits = defineEmits(["book"]);

console.log(room.bookings);

const status = computed(() => {
	if (room.bookings.length === 0) {
		return "Available";
	}

	const bookingLengthInIntervals =
		(searchInterval.to - searchInterval.from) / (1000 * 60) / 15;

	const timeslots = Array.from(
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
			timeslots.length,
			Math.floor((bookingEnd - searchInterval.from) / (1000 * 60 * 15))
		);

		for (let i = bookingStartIndex; i < bookingEndIndex; i++) {
			timeslots[i] = true;
		}
	});

	if (timeslots.every((slot) => slot)) {
		return "Unavailable";
	} else {
		return "Partially Available";
	}
});

function bookRoom() {
	if (status.value === "Available") {
		emits("book", room.room, searchInterval.from, searchInterval.to);
	}
}

const statusClassName = computed(() => status.value.replace(" ", "-"));

const buttonLabel = computed(() => {
	return status.value === "Available"
		? "Book Now"
		: status.value === "Partially Available"
		? "Book Partially"
		: "Unavailable";
});
</script>

<template>
	<div class="item-container">
		<div>
			<div class="heading">Room: {{ room.room }}</div>
			<div>
				Status:
				<span class="status" :class="[statusClassName]">
					{{ status }}
				</span>
			</div>
		</div>
		<div class="btn-group">
			<button
				v-if="status !== 'Unavailable'"
				type="button"
				class="book-btn"
				@click="bookRoom"
			>
				{{ buttonLabel }}
			</button>
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

.book-btn:hover {
	background-color: #0d8bd2;
}
</style>
