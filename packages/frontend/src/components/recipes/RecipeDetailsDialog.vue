<template>
  <q-dialog v-model="dialogModel">
    <q-card v-if="form" class="dialog-recipe-details">
      <q-card-section class="row items-center q-pb-none">
        <div class="font-bold text-xl">
          {{ isEditing ? t('common.edit') : form.title }}
        </div>

        <q-space />

        <q-btn icon="close" flat round dense size="md" @click="closeDialog" />
      </q-card-section>

      <q-card-section class="fields-container">
        <q-input
          v-model="form.imageUrl"
          :readonly="!isEditing"
          :label="t('recipePage.dialogs.addRecipe.labels.imageUrl')"
        />

        <q-input
          v-model="form.title"
          :readonly="!isEditing"
          :label="t('recipePage.dialogs.addRecipe.labels.recipeTitle')"
        />

        <q-input
          v-model="form.description"
          type="textarea"
          :readonly="!isEditing"
          :label="t('recipePage.dialogs.addRecipe.labels.description')"
        />

        <q-select
          v-model="form.categoryId"
          :options="categories"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          clearable
          :disable="!isEditing"
          :label="t('recipePage.dialogs.addRecipe.labels.category')"
        />

        <q-select
          v-model="form.tagIds"
          :options="tags"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          multiple
          use-input
          :disable="!isEditing"
          :label="t('recipePage.dialogs.addRecipe.labels.tags')"
        />

        <div
          v-for="(item, index) in form.ingredients"
          :key="index"
          class="ingredient-fields row items-center q-gutter-sm q-mb-sm"
        >
          <q-select
            v-model="item.ingredientId"
            :options="ingredients"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            class="col"
            :disable="!isEditing"
            :label="t('recipePage.dialogs.addRecipe.labels.ingredient')"
          />

          <q-input
            v-model.number="item.amount"
            type="number"
            class="col-2"
            :readonly="!isEditing"
            :label="
              t(`recipePage.dialogs.addRecipe.labels.${getAmountLabelKey(item.ingredientId)}`)
            "
          />

          <span class="col-1 text-grey">
            {{ getUnitById(item.ingredientId) }}
          </span>

          <template v-if="isEditing">
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
      </q-card-section>

      <q-card-actions align="right">
        <template v-if="!isEditing">
          <q-btn flat color="negative" label="Удалить" @click="removeRecipe" />

          <q-btn flat color="primary" label="Редактировать" @click="startEdit" />

          <q-btn flat color="primary" :label="t('common.close')" @click="closeDialog" />
        </template>

        <template v-else>
          <q-btn flat color="grey" label="Отменить" @click="cancelEdit" />

          <q-btn flat color="positive" label="Сохранить" @click="saveRecipe" />
        </template>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { recipesInfoStore } from 'stores/recipes-info-store';
import { useMetaStore } from 'stores/meta-store';
import type { RecipeForm } from 'src/types';
import type { Recipe, UpdateRecipeDto } from 'src/types/models';

const props = defineProps<{
  modelValue: boolean;
  recipeId: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'updated'): void;
}>();

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const { t } = useI18n();

const recipesStore = recipesInfoStore();
const metaStore = useMetaStore();

const { fetchRecipe, updateRecipe, deleteRecipe } = recipesStore;

const { categories, tags, ingredients } = storeToRefs(metaStore);

const { fetchCategories, fetchTags, fetchIngredients } = metaStore;

const recipe = ref<Recipe | null>(null);

const form = ref<RecipeForm | null>(null);

const originalForm = ref<RecipeForm | null>(null);

const isEditing = ref(false);

const closeDialog = () => {
  isEditing.value = false;
  dialogModel.value = false;
};

const cloneForm = (form: RecipeForm): RecipeForm => ({
  title: form.title,
  description: form.description,
  imageUrl: form.imageUrl,
  categoryId: form.categoryId,
  tagIds: [...form.tagIds],
  ingredients: form.ingredients.map((ingredient) => ({
    ingredientId: ingredient.ingredientId,
    amount: ingredient.amount,
    unit: ingredient.unit,
  })),
});

const mapRecipeToForm = (recipe: Recipe): RecipeForm => ({
  title: recipe.title,
  description: recipe.description,
  imageUrl: recipe.imageUrl || '',

  categoryId: recipe.category?.id || null,

  tagIds: recipe.tags.map((item) => item.tag.id),

  ingredients: recipe.ingredients.map((ingredient) => ({
    ingredientId: ingredient.ingredient.id,

    amount: ingredient.amount,

    unit: ingredient.unit,
  })),
});

const loadRecipe = async () => {
  if (!props.recipeId) {
    return;
  }

  const data = await fetchRecipe(props.recipeId);

  recipe.value = data;
  form.value = mapRecipeToForm(data);
  originalForm.value = cloneForm(form.value);

  isEditing.value = false;
};

watch(
  () => props.modelValue,
  async (isOpen) => {
    console.log('modelValue changed:', isOpen);

    if (isOpen) {
      await loadRecipe();
      return;
    }

    isEditing.value = false;
  },
);

const startEdit = () => {
  console.log('startEdit BEFORE:', isEditing.value);

  isEditing.value = true;

  console.log('startEdit AFTER:', isEditing.value);
};

const cancelEdit = () => {
  if (!originalForm.value) {
    return;
  }

  form.value = cloneForm(originalForm.value);
  isEditing.value = false;
};

const ingredientsMap = computed(
  () => new Map(ingredients.value.map((ingredient) => [ingredient.id, ingredient])),
);

const getUnitById = (id: string | null): string => {
  if (!id) {
    return '';
  }

  return ingredientsMap.value.get(id)?.unit ?? '';
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

const addIngredientRow = () => {
  if (!form.value) {
    return;
  }

  form.value.ingredients.push({
    ingredientId: null,
    amount: null,
    unit: null,
  });
};

const deleteIngredientRow = (index: number) => {
  if (!form.value || form.value.ingredients.length === 1) {
    return;
  }

  form.value.ingredients.splice(index, 1);
};

const buildPayload = (): UpdateRecipeDto => {
  if (!form.value) {
    throw new Error('Recipe form is not initialized');
  }

  return {
    title: form.value.title,

    description: form.value.description,

    ...(form.value.imageUrl && {
      imageUrl: form.value.imageUrl,
    }),

    ...(form.value.categoryId && {
      categoryId: form.value.categoryId,
    }),

    ...(form.value.tagIds.length && {
      tagIds: form.value.tagIds,
    }),

    ingredients: form.value.ingredients.map((ingredient) => ({
      ingredientId: ingredient.ingredientId as string,

      amount: ingredient.amount as number,

      unit: getUnitById(ingredient.ingredientId),
    })),
  };
};

const saveRecipe = async () => {
  if (!recipe.value || !form.value) {
    return;
  }

  const updatedRecipe = await updateRecipe(recipe.value.id, buildPayload());

  recipe.value = updatedRecipe;
  form.value = mapRecipeToForm(updatedRecipe);
  originalForm.value = cloneForm(form.value);

  isEditing.value = false;
};

const removeRecipe = async () => {
  if (!recipe.value) {
    return;
  }

  await deleteRecipe(recipe.value.id);

  closeDialog();
};

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchTags(), fetchIngredients()]);
});
</script>

<style scoped lang="scss">
.dialog-recipe-details {
  min-width: 340px;

  @media (min-width: 768px) {
    min-width: 640px;
  }

  @media (min-width: 1024px) {
    min-width: 740px;
  }
}
</style>
