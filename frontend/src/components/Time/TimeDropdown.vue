<script setup lang="ts">
import { ref } from 'vue';


const showDropdown = ref(false);

function selectItem() {
	showDropdown.value = false;
}
</script>

<template>
	<div>
		<button class="btn" type="button" @click="showDropdown = !showDropdown">
			Dropdown
			<i class="bx bx-chevron-down arrow-icon" :class="{rotate: showDropdown}"></i>
		</button>
		<div class="dropdown" :class="{show: showDropdown}">
			<button type="button" class="dropdown-item" @click="selectItem()">
				Option 1
			</button>
			<button type="button" class="dropdown-item" @click="selectItem()">
				Option 2
			</button>
		</div>
	</div>
</template>

<style scoped>
* {
	--shadow: rgba(0, 0, 0, 0.05) 0px 6px 10px 0px;
}

.btn {
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