<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border: 1px solid rgb(255, 0, 0);
  padding: 1rem;
  margin: 2rem auto;
  max-width: 40rem;
  background-color: #181515;
  color: white;
}
</style>