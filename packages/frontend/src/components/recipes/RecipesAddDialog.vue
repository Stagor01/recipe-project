<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card class="dialog-add-recipe">
      <q-card-section class="row items-center q-pb-none">
        <div class="font-bold text-xl">
          {{ t('recipePage.dialogs.addRecipe.title') }}
        </div>

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

        <div
          v-for="(item, index) in ingredientsForm"
          :key="index"
          class="ingredient-fields row items-center q-gutter-sm q-mb-sm"
        >
          <q-select
            v-model="item.ingredientId"
            :options="filteredIngredients"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            use-input
            fill-input
            hide-selected
            clearable
            class="col"
            :label="t('recipePage.dialogs.addRecipe.labels.ingredient')"
            @filter="filterIngredient"
          />

          <q-input
            v-model.number="item.amount"
            type="number"
            class="col-2"
            :label="
              t(`recipePage.dialogs.addRecipe.labels.${getAmountLabelKey(item.ingredientId)}`)
            "
          />

          <span class="col-1 text-grey">
            {{ getUnitById(item.ingredientId) }}
          </span>

          <q-btn icon="add" flat round @click="addIngredientRow" />

          <q-btn
            icon="delete"
            flat
            round
            :disable="ingredientsForm.length === 1"
            @click="deleteIngredientRow(index)"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="t('common.cancel')" color="primary" v-close-popup />

        <q-btn flat :label="t('common.add')" color="primary" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { recipesInfoStore } from 'stores/recipes-info-store';
import { useMetaStore } from 'stores/meta-store';

import type { CreateRecipeDto, Ingredient, Tag } from 'src/types/models';

import type { IngredientFormItem } from 'src/types';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created'): void;
}>();

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const recipesStore = recipesInfoStore();
const metaStore = useMetaStore();

const { createRecipe } = recipesStore;

const { categories, tags, ingredients } = storeToRefs(metaStore);

const { fetchCategories, fetchTags, fetchIngredients } = metaStore;

const { t } = useI18n();

const imageUrl = ref('');
const recipeTitle = ref('');
const recipeDescription = ref('');

const selectedCategoryId = ref<string | null>(null);
const selectedTagIds = ref<string[]>([]);

const filteredTags = ref<Tag[]>([]);
const filteredIngredients = ref<Ingredient[]>([]);

const ingredientsForm = ref<IngredientFormItem[]>([
  {
    ingredientId: null,
    amount: null,
    unit: null,
  },
]);

const filterTag = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (!val) {
      filteredTags.value = tags.value;
      return;
    }

    const needle = val.toLowerCase();

    filteredTags.value = tags.value.filter((tag) => tag.name.toLowerCase().includes(needle));
  });
};

const filterIngredient = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (!val) {
      filteredIngredients.value = ingredients.value;
      return;
    }

    const needle = val.toLowerCase();

    filteredIngredients.value = ingredients.value.filter((i) =>
      i.name.toLowerCase().includes(needle),
    );
  });
};

const addIngredientRow = () => {
  ingredientsForm.value.push({
    ingredientId: null,
    amount: null,
    unit: null,
  });
};

const deleteIngredientRow = (index: number) => {
  if (ingredientsForm.value.length === 1) {
    return;
  }

  ingredientsForm.value.splice(index, 1);
};

const getUnitById = (id: string | null) => {
  if (!id) {
    return '';
  }

  const ingredient = ingredients.value.find((i) => i.id === id);

  return ingredient?.unit || '';
};

const getAmountLabelKey = (id: string | null) => {
  if (!id) {
    return 'quantity';
  }

  switch (getUnitById(id)) {
    case 'г':
      return 'weight';

    case 'мл':
      return 'volume';

    default:
      return 'quantity';
  }
};

const buildPayload = (): CreateRecipeDto => ({
  title: recipeTitle.value,
  description: recipeDescription.value,

  ...(imageUrl.value && {
    imageUrl: imageUrl.value,
  }),

  ...(selectedCategoryId.value && {
    categoryId: selectedCategoryId.value,
  }),

  ...(selectedTagIds.value.length && {
    tagIds: selectedTagIds.value,
  }),

  ingredients: ingredientsForm.value
    .filter((item) => item.ingredientId && item.amount)
    .map((item) => ({
      ingredientId: item.ingredientId as string,
      amount: item.amount as number,
      unit: getUnitById(item.ingredientId),
    })),
});

const resetForm = () => {
  imageUrl.value = '';
  recipeTitle.value = '';
  recipeDescription.value = '';

  selectedCategoryId.value = null;
  selectedTagIds.value = [];

  ingredientsForm.value = [
    {
      ingredientId: null,
      amount: null,
      unit: null,
    },
  ];
};

const onSubmit = async () => {
  try {
    const payload = buildPayload();

    await createRecipe(payload);

    resetForm();

    dialogModel.value = false;

    emit('created');
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchTags();
  await fetchIngredients();

  filteredTags.value = tags.value;
  filteredIngredients.value = ingredients.value;
});
</script>

<style scoped lang="scss">
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
