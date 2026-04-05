<template>
  <q-page>
    <div class="recipe-cards p-4">
      <q-card v-for="recipe in recipes" :key="recipe.id">
        <img :src="recipe.imageUrl || placeholderImage" />

        <q-card-section>
          <div class="text-h6">{{ recipe.title }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none" v-if="recipe.category">
          <q-chip :color="getRandomColor()">{{ recipe.category.name }}</q-chip>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-chip
            v-for="recipeTag in recipe.tags"
            :key="recipeTag.tag.id"
            :color="getRandomColor()"
            class="q-mr-sm q-mb-sm"
          >
            {{ recipeTag.tag.name }}
          </q-chip>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { recipesInfoStore } from 'stores/recipes-info-store';
import { onMounted } from 'vue';
import { chipColors } from 'src/consts';

const store = recipesInfoStore();
const { recipes, fetchRecipes } = store;

const placeholderImage = 'https://via.placeholder.com/400x200.png?text=No+Image';

const getRandomColor = () => chipColors[Math.floor(Math.random() * chipColors.length)];

onMounted(() => fetchRecipes());
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
