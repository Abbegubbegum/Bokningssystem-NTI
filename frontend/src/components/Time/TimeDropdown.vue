<script setup>
import { ref } from 'vue';

// Create an array of time options that are in the format of 24:00 and in 15 minute increments and starts at 8:00 and ends at 18:00
const timeOptions = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 8;
  const minutes = ['00', '15', '30', '45'];
  return minutes.map((minute) => `${hour}:${minute}`);
}).flat();

timeOptions.push("18:00");

const dropdownText = ref('--:--');

const showDropdown = ref(false);

const container = ref(null);

function selectItem(item) {
  dropdownText.value = item;
	showDropdown.value = false;
}

// Close the dropdown when the user clicks outside of the dropdown
document.addEventListener('click', (e) => {
	if (!container.value.contains(e.target)) {
		showDropdown.value = false;
	}
});

</script>

<template>
	<div class="dropdown-container" ref="container">
		<button class="dropdown-button" type="button" @click="showDropdown = !showDropdown">
			{{ dropdownText  }}
			<i class="bx bx-chevron-down arrow-icon" :class="{rotate: showDropdown}"></i>
		</button>
		<div class="dropdown" :class="{show: showDropdown}">
			<button v-for="option in timeOptions" type="button" class="dropdown-item" @click="selectItem(option)">
				{{ option }}
			</button>
		</div>
	</div>
</template>

<style scoped>
* {
	--shadow: rgba(0, 0, 0, 0.05) 0px 6px 10px 0px;
}



.dropdown-button {
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.5rem;
	cursor: pointer;
	border-radius: 5px;
	border: none;
	box-shadow: var(--shadow);
	position: relative;
  min-width: 10ch;
}

.arrow-icon {
	font-size: 1.1rem;

  transition: 0.2s ease;
}

.rotate {
	transform: rotate(180deg);
}

.dropdown {
  position: absolute;
	display: grid;
	grid-auto-flow: row;
	width: 110px;
	box-shadow: var(--shadow);
	border-radius: 5px;
	margin-top: 0.3rem;
	background-color: white;
  
	transform: translateY(0.5rem);
  visibility: hidden;
  opacity: 0;
  
	transition: 0.2s ease;
  /* make the dropdown div scrollable */
  overflow-y: auto;
  height: 200px;
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
	transform: translateY(0);
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