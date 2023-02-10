<script setup>
import { ref } from "vue";

// Create an array of time options that are in the format of 24:00 and in 15 minute increments and starts at 8:00 and ends at 18:00
const hours = Array.from({ length: 11 }, (_, i) =>
	(i + 8).toString().padStart(2, "0")
);

const minutes = ["00", "15", "30", "45"];

const hourText = ref("--");
const minuteText = ref("--");

const showHoursDropdown = ref(false);
const showMinutesDropdown = ref(false);

const hour = ref(null);
const minute = ref(null);

let isDragging = false;

function setHour(val) {
	hourText.value = val;
	showHoursDropdown.value = false;
}

function setMinute(val) {
	minuteText.value = val;
	showMinutesDropdown.value = false;
}

function startDragging() {
	isDragging = true;
}

function onDropdownMouseDrag(e) {
	if (!isDragging) {
		return;
	}

	const dropdown = e.target;

	console.dir(dropdown);

	dropdown.scrollTop = e.layerY;
}

// Close the dropdown when the user clicks outside of the dropdown
document.addEventListener("click", (e) => {
	if (!hour.value.contains(e.target)) {
		showHoursDropdown.value = false;
	}
	if (!minute.value.contains(e.target)) {
		showMinutesDropdown.value = false;
	}
});
</script>

<template>
	<div class="input-container">
		<div ref="hour" class="button-container">
			<button
				class="dropdown-button"
				type="button"
				@click="showHoursDropdown = !showHoursDropdown"
			>
				{{ hourText }}
			</button>
			<div
				class="dropdown"
				:class="{ show: showHoursDropdown }"
				@mousemove="onDropdownMouseDrag"
				@mousedown="startDragging"
			>
				<div v-for="hour in hours" class="dropdown-item">
					{{ hour }}
				</div>
			</div>
		</div>
		<span>:</span>
		<div ref="minute" class="button-container">
			<button
				class="dropdown-button"
				type="button"
				@click="showMinutesDropdown = !showMinutesDropdown"
			>
				{{ minuteText }}
			</button>
			<div
				class="dropdown"
				:class="{ show: showMinutesDropdown }"
				@mousemove="onDropdownMouseDrag"
				@mousedown="startDragging"
			>
				<div v-for="minute in minutes" class="dropdown-item">
					{{ minute }}
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;500&display=swap");

* {
	--shadow: rgba(0, 0, 0, 0.05) 0px 6px 10px 0px;
	font-family: "Inconsolata", monospace;
}

.input-container {
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.5rem;
	border-radius: 5px;
	border: none;
	/* box-shadow: var(--shadow); */
	position: relative;
	min-width: 11ch;
}

.button-container {
	position: relative;
}

.dropdown-button {
	display: inline-block;
	background-color: #fff;
	outline: 1px solid #f2f2f2;
	min-width: 4ch;
	cursor: pointer;
	border-radius: 5px;
	border: none;
	box-shadow: var(--shadow);
	/* outline: 1px solid orchid; */
}

.arrow-icon {
	font-size: 1.1rem;

	transition: 0.2s ease;
}

.rotate {
	transform: rotate(180deg);
}

.dropdown-wrapper {
	/* make the dropdown div scrollable */
	max-height: 100px;
	scroll-snap-type: y mandatory;
	scroll-snap-align: center;
}

.dropdown {
	position: absolute;
	display: grid;
	grid-auto-flow: row;

	width: 6ch;
	z-index: 1;
	box-shadow: var(--shadow);
	border-radius: 5px;
	background-color: white;

	transform: translateY(-50%);
	top: 50%;

	overflow: scroll;
	max-height: 100px;

	transition: 0.2s ease;

	visibility: hidden;
	opacity: 0;
}

.dropdown::-webkit-scrollbar {
	width: 0.5rem;
}

.dropdown::-webkit-scrollbar-track {
	background: #f3f3f3;
}

.dropdown::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 5px;
}

.show {
	visibility: visible;
	opacity: 1;
}

.dropdown-item {
	display: flex;
	padding: 0.3rem 0.5rem;
	background-color: white;
	border: none;
	cursor: pointer;
}

.dropdown-item:hover {
	background-color: #f2f2f2;
}
</style>
