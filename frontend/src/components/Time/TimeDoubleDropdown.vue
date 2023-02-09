<script setup>
import { ref } from 'vue';

// Create an array of time options that are in the format of 24:00 and in 15 minute increments and starts at 8:00 and ends at 18:00
const hours = Array.from({ length: 11 }, (_, i) => (i + 8).toString().padStart(2, '0'));

const minutes = ['00', '15', '30', '45'];

const hourText = ref('--');
const minuteText = ref('--');

const showHoursDropdown = ref(false);
const showMinutesDropdown = ref(false);

const hour = ref(null);
const minute = ref(null);

function setHour(val) {
  hourText.value = val;
	showHoursDropdown.value = false;
}

function setMinute(val) {
  minuteText.value = val;
  showMinutesDropdown.value = false;
}

// Close the dropdown when the user clicks outside of the dropdown
document.addEventListener('click', (e) => {
	if (!hour.value.contains(e.target)) {
		showHoursDropdown.value = false;
	}
  if (!minute.value.contains(e.target)) {
    showMinutesDropdown.value = false;
  }
});

</script>

<template>
	<div class="dropdown-container">
    <div ref="hour">
		  <button class="dropdown-button" type="button" @click="showHoursDropdown = !showHoursDropdown">
        {{ hourText }}
      </button>
      <div class="dropdown" :class="{show: showHoursDropdown}">
        <button v-for="hour in hours" type="button" class="dropdown-item" @click="setHour(hour)">
          {{ hour }}
        </button>
      </div>
    </div>
    <span>:</span>
    <div ref="minute">
      <button class="dropdown-button" type="button" @click="showMinutesDropdown = !showMinutesDropdown">
        {{ minuteText }}
      </button>
      <div class="dropdown" :class="{show: showMinutesDropdown}">
		    <button v-for="minute in minutes" type="button" class="dropdown-item" @click="setMinute(minute)">
		    	{{ minute }}
		    </button>
	    </div>
    </div>
	</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;500&display=swap');

* {
	--shadow: rgba(0, 0, 0, 0.05) 0px 6px 10px 0px;
  font-family: 'Inconsolata', monospace;
}

.dropdown-container {
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

.dropdown {
  position: absolute;
	display: grid;
	grid-auto-flow: row;
  width: 6ch;
  z-index: 1;
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
  max-height: 200px;
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