<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
	options: {
		type: Array,
		required: true,
	},
});

const container = ref(null);
const dropdown = ref(null);
let dropdownItem;

onMounted(() => {
	dropdownItem = dropdown.value.firstElementChild;
});

const selectedOption = ref("--");

const showDropdown = ref(false);

const isDragging = ref(false);

let prevMouseY = 0;
let prevScrollTop = 0;

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
	prevMouseY = e.pageY;
	prevScrollTop = dropdown.value.scrollTop;
	document.querySelector("body").classList.add("dragging");
}

function stopDragging() {
	isDragging.value = false;
	document.querySelector("body").classList.remove("dragging");
	autoSlide();
}

function autoSlide() {}
</script>

<template>
	<div ref="container" class="button-container">
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
			:class="{ show: showDropdown }"
			@mousedown="startDragging"
			@mouseup="stopDragging"
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

.dropdown {
	position: absolute;
	max-height: 100px;
	width: 6ch;

	overflow: scroll;

	visibility: hidden;
	opacity: 0;

	transform: translateY(-50%);
	top: 50%;

	z-index: 1;
	box-shadow: var(--shadow);
	border-radius: 5px;
	background-color: white;

	transition: 0.2s ease;
}
.dropdown,
.dropdown * {
	cursor: grab;
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

.dropdown-items {
	display: grid;
	grid-auto-flow: row;
	grid-template-rows: 1fr;
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

.dropdown-item:hover {
	background-color: #f2f2f2;
}
</style>
