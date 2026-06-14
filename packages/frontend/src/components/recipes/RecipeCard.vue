<template>
  <q-card>
    <img :src="recipe.imageUrl || placeholderImage" />

    <q-card-section>
      <div class="text-h6">
        {{ recipe.title }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section v-if="recipe.category" class="q-pt-none">
      <q-chip :color="getRandomColor()">
        {{ recipe.category.name }}
      </q-chip>
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
</template>

<script setup lang="ts">
import { chipColors } from 'src/consts';
import type { Recipe } from 'src/types/models';

defineProps<{
  recipe: Recipe;
}>();

const placeholderImage = 'https://via.placeholder.com/400x200.png?text=No+Image';

const getRandomColor = () => chipColors[Math.floor(Math.random() * chipColors.length)];
</script>
