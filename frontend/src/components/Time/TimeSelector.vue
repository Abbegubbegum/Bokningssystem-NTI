<script setup>
import TimeDropdown from './TimeDropdown.vue';
import TimeDoubleDropdown from './TimeDoubleDropdown.vue';
import TimeRollingSelect from './TimeRollingSelect.vue';

</script>

<template>
  <div class="container">
    <span>From:</span>
    <TimeDropdown />
    <!-- <span class="hyphen">----</span> -->
    <span>To:</span>
    <TimeDoubleDropdown />
    <TimeRollingSelect />
  </div>
</template>


<style scoped>
.container {
    min-width: 20rem;
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