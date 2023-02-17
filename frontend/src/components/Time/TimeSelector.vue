<script setup>
import { ref } from "vue";
import TimeDropdown from "./TimeDropdown.vue";
import TimeDoubleDropdown from "./TimeDoubleDropdown.vue";
import TimeRollingSelect from "./TimeRollingSelect.vue";

defineExpose({ getTime });

const toTimeDefault = new Date(Date.now());

toTimeDefault.setMinutes(toTimeDefault.getMinutes() + 15);

const fromTime = ref(null);
const toTime = ref(null);

function getTime() {
	const from = fromTime.value.submit();
	const to = toTime.value.submit();

	if (!from || !to) {
		alert("Please select a Time!");
		return undefined;
	}

	if (from.hour > to.hour) {
		alert("From time must be before to time");
		return undefined;
	}

	if (from.hour === to.hour && from.minute >= to.minute) {
		alert("From time must be before to time");
		return undefined;
	}

	return { from, to };
}
</script>

<template>
	<div class="time-selector">
		<div>
			<span>From:</span>
			<TimeRollingSelect ref="fromTime" />
		</div>
		<!-- <span class="hyphen">----</span> -->
		<div>
			<span>To:</span>
			<TimeRollingSelect ref="toTime" :default="toTimeDefault" />
		</div>
	</div>
</template>

<style scoped>
.time-selector {
	display: grid;
	grid-auto-flow: column;
	width: 100%;
	place-items: center;
}
</style>
