<script setup>
const { item } = defineProps({
	item: {
		type: Object,
	},
});
</script>

<template>
	<div>
		{{ item.room }}
		{{ item.bookings.length }}
	</div>
</template>

<style scoped></style>
