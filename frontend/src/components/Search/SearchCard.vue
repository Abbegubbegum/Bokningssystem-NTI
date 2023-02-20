<script setup>
import { ref } from "vue";
import TimeSelector from "../Time/TimeSelector.vue";

const emit = defineEmits(["search"]);

const timeSelector = ref(null);

function submit() {
	const time = timeSelector.value.getTime();

	if (!time) return;

	const { from, to } = time;

	emit("search", {
		from: from.toJSON(),
		to: to.toJSON(),
	});
}
</script>

<template>
	<div class="search-card">
		<TimeSelector ref="timeSelector" />
		<div class="btn-group">
			<button type="button" class="search-btn" @click="submit">
				Search
			</button>
		</div>
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
	padding: 1rem 1rem;
	box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 10px 0px;
}

.btn-group {
	display: flex;
	justify-content: end;
	align-items: center;
	width: 100%;
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
</style>
