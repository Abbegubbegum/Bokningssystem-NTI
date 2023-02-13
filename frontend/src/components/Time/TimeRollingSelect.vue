<script setup>
import { ref } from "vue";
import SingleRollingField from "./SingleRollingField.vue";

const props = defineProps({
	default: {
		type: Date,
		default: new Date(Date.now()),
	},
});

defineExpose({
	submit,
});

// Create an array of time options that are in the format of 24:00 and in 15 minute increments and starts at 8:00 and ends at 18:00
const hours = Array.from({ length: 11 }, (_, i) =>
	(i + 8).toString().padStart(2, "0")
);

const startingHourIndex = Math.min(
	Math.max(0, props.default.getHours() - 8),
	11
);

const minutes = ["00", "15", "30", "45"];
const startingMinuteIndex = Math.floor(props.default.getMinutes() / 15);

const hoursField = ref(null);
const minutesField = ref(null);

function submit() {
	const hour = hoursField.value.submit();
	const minute = minutesField.value.submit();

	if (hour === null || minute === null) {
		return null;
	}

	return {
		hour,
		minute,
	};
}
</script>

<template>
	<div class="input-container">
		<SingleRollingField
			:options="hours"
			:starting-index="startingHourIndex"
			ref="hoursField"
		/>
		<span>:</span>
		<SingleRollingField
			:options="minutes"
			:starting-index="startingMinuteIndex"
			ref="minutesField"
		/>
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
	justify-content: start;
	gap: 0.2rem;
	border-radius: 5px;
	border: none;
	/* box-shadow: var(--shadow); */
	position: relative;
	min-width: 11ch;
}
</style>
