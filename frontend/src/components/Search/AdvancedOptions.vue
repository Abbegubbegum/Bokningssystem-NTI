<script setup>
import { ref } from "vue";

defineExpose({
	getOptions,
});

const day = ref(new Date());

function getOptions() {
	return {
		day: day.value,
	};
}
</script>

<template>
	<div>
		<label>
			Day:
			<input
				type="date"
				@input="day = $event.target.valueAsDate"
				:value="day.toJSON().slice(0, 10)"
			/>
		</label>
	</div>
</template>

<style scoped></style>
