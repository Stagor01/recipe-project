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

      <q-form @submit.prevent="onSubmit">
        <RecipeForm v-model="form" />

        <q-card-actions align="right">
          <q-btn flat :label="t('common.cancel')" color="primary" v-close-popup />

          <q-btn type="submit" flat :label="t('common.add')" color="primary" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { recipesInfoStore } from 'stores/recipes-info-store';
import RecipeForm from './RecipeForm.vue';

import type { CreateRecipeDto } from 'src/types/models';
import type { RecipeForm as RecipeFormType } from 'src/types';

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

const { t } = useI18n();

const recipesStore = recipesInfoStore();

const { createRecipe } = recipesStore;

const createEmptyForm = (): RecipeFormType => ({
  title: '',
  description: '',
  imageUrl: '',
  categoryId: null,
  tagIds: [],
  ingredients: [
    {
      ingredientId: null,
      amount: null,
      unit: null,
    },
  ],
});

const form = ref<RecipeFormType>(createEmptyForm());

const buildPayload = (): CreateRecipeDto => ({
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
});

const resetForm = () => {
  form.value = createEmptyForm();
};

const onSubmit = async () => {
  try {
    await createRecipe(buildPayload());

    resetForm();
    dialogModel.value = false;

    emit('created');
  } catch (error) {
    console.error(error);
  }
};
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
