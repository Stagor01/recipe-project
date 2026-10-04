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

      <q-form ref="formRef" @submit.prevent="saveRecipe">
        <RecipeForm v-model="form" :readonly="!isEditing" />

        <q-card-actions align="right">
          <template v-if="!isEditing">
            <q-btn
              flat
              color="negative"
              :label="t('common.delete')"
              @click="deleteConfirmDialog = true"
            />

            <q-btn flat color="primary" :label="t('common.edit')" @click="startEdit" />

            <q-btn flat color="primary" :label="t('common.close')" @click="closeDialog" />
          </template>

          <template v-else>
            <q-btn flat color="grey" :label="t('common.cancel')" @click="cancelEdit" />

            <q-btn type="submit" flat color="positive" :label="t('common.save')" />
          </template>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <RecipeDeleteConfirm v-model="deleteConfirmDialog" @confirm="removeRecipe" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QForm } from 'quasar';

import { recipesInfoStore } from 'stores/recipes-info-store';

import RecipeForm from './RecipeForm.vue';
import RecipeDeleteConfirm from './RecipeDeleteConfirm.vue';

import type { RecipeForm as RecipeFormType } from 'src/types';
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

const { fetchRecipe, updateRecipe, deleteRecipe } = recipesStore;

const recipe = ref<Recipe | null>(null);

const form = ref<RecipeFormType | null>(null);

const originalForm = ref<RecipeFormType | null>(null);

const formRef = ref<QForm | null>(null);

const isEditing = ref(false);

const deleteConfirmDialog = ref(false);

const closeDialog = () => {
  isEditing.value = false;
  dialogModel.value = false;
};

const cloneForm = (source: RecipeFormType): RecipeFormType => ({
  title: source.title,
  description: source.description,
  imageUrl: source.imageUrl,
  categoryId: source.categoryId,
  tagIds: [...source.tagIds],
  ingredients: source.ingredients.map((ingredient) => ({
    ingredientId: ingredient.ingredientId,
    amount: ingredient.amount,
    unit: ingredient.unit,
  })),
});

const mapRecipeToForm = (recipe: Recipe): RecipeFormType => ({
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
    if (isOpen) {
      await loadRecipe();
      return;
    }

    isEditing.value = false;
  },
);

const startEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  if (!originalForm.value) {
    return;
  }

  form.value = cloneForm(originalForm.value);
  isEditing.value = false;
};

const buildPayload = (): UpdateRecipeDto => {
  if (!form.value) {
    throw new Error('Recipe form is not initialized');
  }

  return {
    title: form.value.title.trim(),
    description: form.value.description.trim(),

    ...(form.value.imageUrl.trim() && {
      imageUrl: form.value.imageUrl.trim(),
    }),

    categoryId: form.value.categoryId as string,

    ...(form.value.tagIds.length && {
      tagIds: form.value.tagIds,
    }),

    ingredients: form.value.ingredients.map((ingredient) => ({
      ingredientId: ingredient.ingredientId as string,
      amount: ingredient.amount as number,
      unit: ingredient.unit ?? '',
    })),
  };
};

const saveRecipe = async () => {
  if (!recipe.value || !form.value) {
    return;
  }

  const isValid = await formRef.value?.validate();

  if (!isValid) {
    return;
  }

  try {
    const updatedRecipe = await updateRecipe(recipe.value.id, buildPayload());

    recipe.value = updatedRecipe;
    form.value = mapRecipeToForm(updatedRecipe);
    originalForm.value = cloneForm(form.value);

    isEditing.value = false;

    emit('updated');
  } catch (error) {
    console.error(error);
  }
};

const removeRecipe = async () => {
  if (!recipe.value) {
    return;
  }

  try {
    await deleteRecipe(recipe.value.id);

    closeDialog();
  } catch (error) {
    console.error(error);
  }
};
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
