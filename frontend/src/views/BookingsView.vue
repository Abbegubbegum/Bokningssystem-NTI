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
						start: '2023-02-24T13:45:00.000Z',
						end: '2023-02-24T14:45:00.000Z',
					},
				],
			}"
			:week="new Date()"
		/>
	</div>
</template>

<style scoped></style>
