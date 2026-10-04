<template>
  <div class="fields-container p-4">
    <q-input
      v-model="form.imageUrl"
      :readonly="readonly"
      :label="t('recipePage.dialogs.addRecipe.labels.imageUrl')"
      :placeholder="t('recipePage.dialogs.addRecipe.placeholders.imageUrl')"
      clearable
    />

    <q-input
      v-model="form.title"
      :readonly="readonly"
      :rules="readonly ? [] : [requiredRule]"
      lazy-rules
      :label="t('recipePage.dialogs.addRecipe.labels.recipeTitle')"
      :placeholder="t('recipePage.dialogs.addRecipe.placeholders.recipeTitle')"
      clearable
    />

    <q-input
      v-model="form.description"
      :readonly="readonly"
      :rules="readonly ? [] : [requiredRule]"
      lazy-rules
      type="textarea"
      :label="t('recipePage.dialogs.addRecipe.labels.description')"
      :placeholder="t('recipePage.dialogs.addRecipe.placeholders.description')"
    />

    <q-select
      v-model="form.categoryId"
      :options="categories"
      option-label="name"
      option-value="id"
      emit-value
      map-options
      clearable
      :disable="readonly"
      :rules="readonly ? [] : [requiredRule]"
      lazy-rules
      :label="t('recipePage.dialogs.addRecipe.labels.category')"
    />

    <q-select
      v-model="form.tagIds"
      :options="filteredTags"
      option-label="name"
      option-value="id"
      emit-value
      map-options
      multiple
      use-input
      clearable
      :disable="readonly"
      :label="t('recipePage.dialogs.addRecipe.labels.tags')"
      @filter="filterTag"
    />

    <div
      v-for="(item, index) in form.ingredients"
      :key="index"
      class="ingredient-fields row items-center q-gutter-sm"
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
        :disable="readonly"
        :rules="readonly ? [] : [requiredRule]"
        lazy-rules
        :label="t('recipePage.dialogs.addRecipe.labels.ingredient')"
        @filter="filterIngredient"
      />

      <q-input
        v-model.number="item.amount"
        type="number"
        class="col-2"
        :readonly="readonly"
        :rules="readonly ? [] : [amountRule]"
        lazy-rules
        :label="t(`recipePage.dialogs.addRecipe.labels.${getAmountLabelKey(item.ingredientId)}`)"
      />

      <span class="col-1 text-grey">
        {{ getUnitById(item.ingredientId) }}
      </span>

      <template v-if="!readonly">
        <q-btn icon="add" flat round @click="addIngredientRow" />

        <q-btn
          icon="delete"
          flat
          round
          :disable="form.ingredients.length === 1"
          @click="deleteIngredientRow(index)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { useMetaStore } from 'stores/meta-store';

import type { Ingredient, Tag } from 'src/types/models';
import type { RecipeForm } from 'src/types';

const props = withDefaults(
  defineProps<{
    modelValue: RecipeForm;
    readonly?: boolean;
  }>(),
  {
    readonly: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: RecipeForm): void;
}>();

const { t } = useI18n();

const metaStore = useMetaStore();

const { categories, tags, ingredients } = storeToRefs(metaStore);

const { fetchCategories, fetchTags, fetchIngredients } = metaStore;

const form = computed({
  get: () => props.modelValue,
  set: (value: RecipeForm) => emit('update:modelValue', value),
});

const filteredTags = ref<Tag[]>([]);
const filteredIngredients = ref<Ingredient[]>([]);

const requiredRule = (value: unknown) => {
  if (typeof value === 'string') {
    return value.trim().length > 0 || 'Поле обязательно для заполнения';
  }

  return value !== null && value !== undefined && value !== ''
    ? true
    : 'Поле обязательно для заполнения';
};

const amountRule = (value: number | null) => {
  if (value === null || value === undefined) {
    return 'Укажите количество';
  }

  return value > 0 || 'Количество должно быть больше 0';
};

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

    filteredIngredients.value = ingredients.value.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(needle),
    );
  });
};

const addIngredientRow = () => {
  form.value.ingredients.push({
    ingredientId: null,
    amount: null,
    unit: null,
  });
};

const deleteIngredientRow = (index: number) => {
  if (form.value.ingredients.length === 1) {
    return;
  }

  form.value.ingredients.splice(index, 1);
};

const getUnitById = (id: string | null): string => {
  if (!id) {
    return '';
  }

  return ingredients.value.find((ingredient) => ingredient.id === id)?.unit ?? '';
};

const getAmountLabelKey = (id: string | null) => {
  switch (getUnitById(id)) {
    case 'г':
      return 'weight';

    case 'мл':
      return 'volume';

    default:
      return 'quantity';
  }
};

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchTags(), fetchIngredients()]);

  filteredTags.value = tags.value;
  filteredIngredients.value = ingredients.value;
});
</script>
