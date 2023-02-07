<script setup lang="ts">
import TimeDropdown from './TimeDropdown.vue';


</script>

<template>
    <div class="input-container">
        <span>To:</span>
        <TimeDropdown />
        <!-- <span class="hyphen">----</span> -->
        <span>From:</span>
        <TimeDropdown />
    </div>
</template>


<style scoped>
.input-container {
    width: 20rem;
    height: 2.5rem;
    border: 1px solid #555;
    border-radius: 1.5rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 2rem;
}

.hyphen {
    font-size: 2rem;
    font-weight: 100;
    letter-spacing: -.5rem;
}
</style>