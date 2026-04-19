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

    <q-btn
      icon="add"
      class="absolute-bottom-right q-mb-md q-mr-md"
      round
      size="xl"
      @click="add = true"
    />

    <q-dialog v-model="add" persistent>
      <q-card class="dialog-add-recipe">
        <q-card-section class="row items-center q-pb-none">
          <div class="font-bold text-xl">{{ t('recipePage.dialogs.addRecipe.title') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense size="md" v-close-popup />
        </q-card-section>

        <q-card-section class="fields-container">
          <q-input
            v-model="imageUrl"
            :label="t('recipePage.dialogs.addRecipe.labels.imageUrl')"
            :placeholder="t('recipePage.dialogs.addRecipe.placeholders.imageUrl')"
            clearable
          />

          <q-input
            v-model="recipeTitle"
            :label="t('recipePage.dialogs.addRecipe.labels.recipeTitle')"
            :placeholder="t('recipePage.dialogs.addRecipe.placeholders.recipeTitle')"
            clearable
          />

          <q-input
            v-model="recipeDescription"
            :label="t('recipePage.dialogs.addRecipe.labels.description')"
            :placeholder="t('recipePage.dialogs.addRecipe.placeholders.description')"
            type="textarea"
          />

          <q-select
            v-model="selectedCategoryId"
            :options="categories"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            clearable
            :label="t('recipePage.dialogs.addRecipe.labels.category')"
          />

          <q-select
            v-model="selectedTagIds"
            :options="filteredTags"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            multiple
            use-input
            clearable
            :label="t('recipePage.dialogs.addRecipe.labels.tags')"
            @filter="filterTag"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="t('common.cancel')" color="primary" v-close-popup />
          <q-btn flat :label="t('common.add')" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { recipesInfoStore } from 'stores/recipes-info-store';
import { onMounted, ref } from 'vue';
import { chipColors } from 'src/consts';
import { useI18n } from 'vue-i18n';
import { useMetaStore } from 'stores/meta-store';
import { storeToRefs } from 'pinia';
import type { Tag } from 'src/types/models';
// import { useQuasar } from 'quasar';
// import { RecipeAddDialog } from 'components/recipes';

const store = recipesInfoStore();
const metaStore = useMetaStore();
const { recipes, fetchRecipes } = store;
const { categories, tags } = storeToRefs(metaStore);
const { fetchCategories, fetchTags } = metaStore;
const { t } = useI18n();
// const q = useQuasar();

const add = ref(false);
const imageUrl = ref<string>('');
const recipeTitle = ref<string>('');
const recipeDescription = ref<string>('');
const selectedCategoryId = ref<string | null>(null);
const selectedTagIds = ref<string[]>([]);

const filteredTags = ref<Tag[]>([]);

const placeholderImage = 'https://via.placeholder.com/400x200.png?text=No+Image';

const getRandomColor = () => chipColors[Math.floor(Math.random() * chipColors.length)];

const filterTag = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredTags.value = tags.value;
      return;
    }

    const needle = val.toLowerCase();

    filteredTags.value = tags.value.filter((tag) => tag.name.toLowerCase().includes(needle));
  });
};

// const onAddDialog = () => {
//   q.dialog({
//     component: RecipeAddDialog,
//   });
// };
onMounted(async () => {
  await fetchRecipes();
  await fetchCategories();
  await fetchTags();

  filteredTags.value = tags.value;
});
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

// Стили для диалога

.dialog-add-recipe {
  min-width: 340px;

  @media (min-width: 768px) {
    min-width: 640px;
  }

  @media (min-width: 1024px) {
    min-width: 740px;
  }
}
</style>
