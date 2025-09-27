<template>
  <q-layout :view="isDesktop ? 'LHh Lpr lff' : 'hHh lpr lff'">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Recipe App</q-toolbar-title>

        <q-btn
          flat
          :icon="currentLocale === 'en-US' ? 'outlined_flag' : 'flag'"
          @click="toggleLocale"
        >
          <q-tooltip>
            {{ currentLocale === 'en-US' ? 'Переключить на русский' : 'Switch to English' }}
          </q-tooltip>
        </q-btn>

        <q-btn
          flat
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="$q.dark.toggle()"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="isLeftDrawerMini"
      :mini-width="68"
      :width="280"
      behavior="desktop"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>Navigation</q-item-label>

        <MenuItemsRoutes
          v-for="item in menuItems"
          :key="item.label"
          :label="item.label"
          :caption="item.caption"
          :icon="item.icon"
          :to="item.to"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import MenuItemsRoutes from 'components/MenuItemsRoutes.vue';
import { useMediaBreakpoints } from 'src/composables';
import type { MenuItem } from 'src/types';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { isDesktop } = useMediaBreakpoints();
const { locale, t } = useI18n();

const currentLocale = computed(() => locale.value);

const leftDrawerOpen = ref(false);
const isLeftDrawerMini = ref(false);

const menuItems = computed<MenuItem[]>(() => [
  {
    label: `${t('menu.labels.home')}`,
    caption: `${t('menu.captions.home')}`,
    icon: 'home',
    to: '/',
  },
  {
    label: `${t('menu.labels.recipes')}`,
    caption: `${t('menu.captions.recipes')}`,
    icon: 'restaurant_menu',
    to: '/recipes',
  },
  {
    label: `${t('menu.labels.calculator')}`,
    caption: `${t('menu.captions.recipes')}`,
    icon: 'calculate',
    to: '/calculator',
  },
  {
    label: `${t('menu.labels.fridge')}`,
    caption: `${t('menu.captions.fridge')}`,
    icon: 'kitchen',
    to: '/fridge',
  },
]);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleLocale() {
  locale.value = locale.value === 'en-US' ? 'ru-RU' : 'en-US';

  localStorage.setItem('user-locale', locale.value);
}
</script>
