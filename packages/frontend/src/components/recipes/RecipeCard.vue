<template>
  <q-card class="cursor-pointer" @click="emit('click', recipe.id)">
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

    <q-card-section class="q-pt-none row items-center q-gutter-sm">
      <q-chip v-for="recipeTag in visibleTags" :key="recipeTag.tag.id" :color="getRandomColor()">
        {{ recipeTag.tag.name }}
      </q-chip>

      <q-chip v-if="hiddenTags.length" clickable color="grey-7" text-color="white">
        <q-menu anchor="bottom start" self="top start">
          <q-list style="min-width: 150px">
            <q-item v-for="t in hiddenTags" :key="t.tag.id" dense>
              <q-item-section>
                {{ t.tag.name }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>

        +{{ hiddenTags.length }}
      </q-chip>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { chipColors, TAG_LIMIT } from 'src/consts';
import type { Recipe } from 'src/types/models';

const props = defineProps<{
  recipe: Recipe;
}>();

const emit = defineEmits<{
  (e: 'click', recipeId: string): void;
}>();

const placeholderImage = 'https://via.placeholder.com/400x200.png?text=No+Image';

const getRandomColor = () => chipColors[Math.floor(Math.random() * chipColors.length)];

const visibleTags = computed(() => props.recipe.tags.slice(0, TAG_LIMIT));

const hiddenTags = computed(() => props.recipe.tags.slice(TAG_LIMIT));
</script>
