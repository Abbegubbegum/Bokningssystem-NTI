<script setup>
import { ref } from "vue";
import TimeSelector from "../Time/TimeSelector.vue";
import AdvancedOptions from "./AdvancedOptions.vue";

const emit = defineEmits(["search"]);

const timeSelector = ref(null);

const advancedOptions = ref(null);

const showAdvanced = ref(false);

function submit() {
	const selectedTime = timeSelector.value.getTime();

	const options = advancedOptions.value.getOptions();

	if (!selectedTime) return;

	const to = parseTime(selectedTime.to, options.day).toJSON();
	const from = parseTime(selectedTime.from, options.day).toJSON();

	emit("search", { from, to });
}

function parseTime(time, date) {
	const newDate = new Date(date);

	newDate.setHours(time.hour, time.minute, 0, 0);

	return newDate;
}
</script>

<template>
	<div class="search-card">
		<TimeSelector ref="timeSelector" />
		<div class="btn-group">
			<button
				type="button"
				class="advanced-btn"
				@click="showAdvanced = !showAdvanced"
			>
				Advanced Search
				<!-- <img src="@/assets/icons/slider.svg" class="sliders-icon" /> -->
			</button>
			<button type="button" class="search-btn" @click="submit">
				Search
			</button>
		</div>
		<AdvancedOptions
			ref="advancedOptions"
			class="advanced"
			:class="{ hide: !showAdvanced }"
		/>
	</div>
</template>

<style scoped>
.search-card {
	margin-top: 2rem;
	width: 30rem;
	border: 1px solid #555;
	border-radius: 3rem;
	display: grid;
	grid-template-columns: 1fr 1fr;
	place-items: center;
	padding: 1rem 0;
	box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 10px 0px;
}

.btn-group {
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;
}

.advanced-btn {
	background-color: transparent;
	border: none;
	font-size: 0.9rem;
	text-align: center;
	width: 6rem;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.advanced-btn:hover {
	color: #555;
	font-weight: bold;
}

.sliders-icon {
	width: 2rem;
	margin-left: 1rem;
}

.search-btn {
	background-color: transparent;
	border: 1px solid #555;
	border-radius: 2rem;
	padding: 0.5rem 1rem;
	cursor: pointer;
}

.search-btn:hover {
	background-color: #555;
	color: white;
}

.advanced {
	margin-top: 1rem;
	padding-left: 1rem;
	overflow: hidden;
	height: 10rem;
	transition: height 0.2s ease-in-out;
	grid-column: 1 / 3;
	justify-self: stretch;
}

.hide {
	height: 0;
}
</style>
