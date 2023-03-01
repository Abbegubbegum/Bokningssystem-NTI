<script setup>
import { ref } from "vue";

defineExpose({
	confirm,
});

const showConfirmationPopup = ref(false);

const _prompt = ref("");
const _subprompt = ref("");

let resolve;

function confirm(prompt, subprompt = "") {
	showConfirmationPopup.value = true;
	_prompt.value = prompt;
	_subprompt.value = subprompt;

	return new Promise((res, rej) => {
		resolve = res;
	});
}

function cancel() {
	showConfirmationPopup.value = false;
	if (resolve) {
		resolve(false);
	}
}

function ok() {
	showConfirmationPopup.value = false;
	if (resolve) {
		resolve(true);
	}
}
</script>

<template>
	<div
		class="confirmation-popup-wrapper"
		:class="{ show: showConfirmationPopup }"
	>
		<div class="confirmation-popup">
			<div class="confirmation-label">
				<h1 class="confirmation-prompt">
					{{ _prompt }}
				</h1>
				<h2 class="confirmation-subprompt">
					{{ _subprompt }}
				</h2>
			</div>

			<div class="confirmation-btn-group">
				<button
					type="button"
					class="confirmation-btn cancel-btn"
					@click="cancel"
				>
					Cancel
				</button>
				<button
					type="button"
					class="confirmation-btn confirm-btn"
					@click="ok"
				>
					Confirm
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.confirmation-popup-wrapper {
	display: none;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(1px);
	z-index: 100;
}

.show {
	display: flex;
}

.confirmation-popup {
	background-color: white;
	border-radius: 0.5rem;
	padding: 1rem 2rem;
	display: grid;
	grid-template-rows: auto 1fr;
	gap: 3rem;
}

.confirmation-label {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.confirmation-prompt {
	font-size: 1.7rem;
}

.confirmation-subprompt {
	font-size: 1.2rem;
	color: #555;
}

.confirmation-btn-group {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
}

.confirmation-btn {
	border: none;
	border-radius: 0.5rem;
	color: #fff;
	font-size: 1.2rem;
	font-weight: bold;
	padding: 0.5rem;

	cursor: pointer;
	transition: background-color 100ms ease;
}

.cancel-btn {
	background-color: rgb(235, 40, 40);
}

.cancel-btn:hover {
	background-color: rgb(255 0 0);
}

.confirm-btn {
	background-color: rgb(34 197 94);
}

.confirm-btn:hover {
	background-color: rgb(34, 216, 101);
}
</style>
