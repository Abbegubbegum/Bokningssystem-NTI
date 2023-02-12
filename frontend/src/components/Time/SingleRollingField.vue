<script setup>
import { ref } from "vue";

const props = defineProps({
	options: {
		type: Array,
		required: true,
	},
});

defineExpose({
	submit,
});

const container = ref(null);
const dropdown = ref(null);

const itemHeight = ref(35);

const selectedOption = ref(props.options[0]);

const showDropdown = ref(false);

const isDragging = ref(false);

let prevMouseY = 0;
let prevScrollTop = 0;

let scrollTimeout;

document.addEventListener("mousedown", (e) => {
	if (!container.value.contains(e.target) && !isDragging.value) {
		showDropdown.value = false;
	}
});

document.addEventListener("mousemove", onMouseMove);

document.addEventListener("mouseup", stopDragging);

function onMouseMove(e) {
	if (!isDragging.value) {
		return;
	}

	let dragDistance = e.pageY - prevMouseY;

	dropdown.value.scrollTop = prevScrollTop - dragDistance;
}

function startDragging(e) {
	isDragging.value = true;
	clearTimeout(scrollTimeout);
	prevMouseY = e.pageY;
	prevScrollTop = dropdown.value.scrollTop;
	document.querySelector("body").classList.add("dragging");
}

function stopDragging() {
	isDragging.value = false;
	document.querySelector("body").classList.remove("dragging");

	const startScrollPosition = dropdown.value.scrollTop;
	const closestScrollPosition = Math.round(
		startScrollPosition / itemHeight.value
	);

	selectedOption.value = props.options[closestScrollPosition];

	const endScrollPosition = closestScrollPosition * itemHeight.value;

	scrollTimeout = setTimeout(() => {
		dropdown.value.scrollTop = endScrollPosition;
	}, 10);
}

function submit() {
	return parseInt(selectedOption.value);
}
</script>

<template>
	<div
		ref="container"
		class="button-container"
		:style="`--item-height: ${itemHeight}px`"
	>
		<button
			class="dropdown-button"
			type="button"
			@click="showDropdown = !showDropdown"
		>
			{{ selectedOption }}
		</button>
		<div
			class="dropdown"
			ref="dropdown"
			:class="{ show: showDropdown, dragging: isDragging }"
			@mousedown="startDragging"
		>
			<div class="dropdown-items">
				<div v-for="option in props.options" class="dropdown-item">
					{{ option }}
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;500&display=swap");

* {
	font-family: "Inconsolata", monospace;
}
.button-container {
	position: relative;
}

.dropdown-button {
	display: inline-block;
	height: var(--item-height);
	background-color: #fff;
	outline: 1px solid #f2f2f2;
	min-width: 4ch;
	cursor: pointer;
	border-radius: 5px;
	border: none;
	box-shadow: var(--shadow);
	/* outline: 1px solid orchid; */
}

.dropdown {
	position: absolute;
	height: calc(var(--item-height) * 3);
	width: 6ch;

	padding-top: var(--item-height);
	padding-bottom: var(--item-height);

	overflow: hidden;
	scroll-behavior: smooth;

	visibility: hidden;
	opacity: 0;

	transform: translateY(-50%);
	top: 50%;

	z-index: 1;
	box-shadow: var(--shadow);
	border-radius: 5px;
	background-color: white;

	transition: all 0.2s ease;
}

.dropdown,
.dropdown * {
	cursor: grab;
}

.dropdown.dragging {
	scroll-behavior: auto;
}

.show {
	visibility: visible;
	opacity: 1;
}

.dropdown-items {
	display: grid;
	grid-auto-rows: var(--item-height);
}

.dropdown-item {
	display: flex;
	padding: 0.3rem 0.5rem;
	background-color: white;
	border: none;

	/* Stop the user from selecting the text */
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
</style>
