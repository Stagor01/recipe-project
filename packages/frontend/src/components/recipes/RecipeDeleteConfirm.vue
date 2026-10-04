<template>
  <q-dialog v-model="dialogModel">
    <q-card class="delete-confirm">
      <q-card-section>
        <div class="text-h6">{{ t('recipePage.dialogs.deleteConfirm.title') }}</div>
      </q-card-section>

      <q-card-section>
        {{ t('recipePage.dialogs.deleteConfirm.description') }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="grey" :label="t('common.cancel')" @click="cancel" />

        <q-btn flat color="negative" :label="t('common.delete')" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
}>();

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const cancel = () => {
  dialogModel.value = false;
};

const confirm = () => {
  emit('confirm');
  dialogModel.value = false;
};
</script>

<style scoped lang="scss">
.delete-confirm {
  min-width: 340px;

  @media (min-width: 768px) {
    min-width: 500px;
  }
}
</style>
