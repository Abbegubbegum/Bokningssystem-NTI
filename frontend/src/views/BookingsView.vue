<script setup>
import RoomSchedule from "../components/Schedule/RoomSchedule.vue";
</script>

<template>
	<div>
		<RoomSchedule
			:room="{
				room: '511',
				bookings: [
					{
						booker: { name: 'Albin Norbäck' },
						start: '2023-02-22T13:45:00.000Z',
						end: '2023-02-22T14:45:00.000Z',
					},
				],
			}"
		/>
	</div>
</template>

<style scoped></style>
