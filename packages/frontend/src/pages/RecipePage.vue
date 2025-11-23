<template>
  <q-page>
    <div class="recipe-cards p-4">
      <RecipeCard v-for="n in 10" :key="n" />
    </div>
  </q-page>
</template>
<script setup lang="ts">
import RecipeCard from 'components/recipes/RecipeCard.vue';
</script>

<style scoped lang="scss">
.recipe-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1920px) {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
