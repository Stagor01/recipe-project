<template>
  <q-layout :view="isDesktop ? 'LHh Lpr lff' : 'hHh lpr lff'">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Recipe App</q-toolbar-title>
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
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import MenuItemsRoutes from 'components/MenuItemsRoutes.vue';
import { useMediaBreakpoints } from 'src/composables';
import type { MenuItem } from 'src/types';

const $q = useQuasar();
const { isDesktop } = useMediaBreakpoints();

const leftDrawerOpen = ref(false);
const isLeftDrawerMini = ref(false);

const menuItems: MenuItem[] = [
  {
    label: 'Home',
    caption: 'Main page',
    icon: 'home',
    to: '/',
  },
  {
    label: 'Recipes',
    caption: 'Recipes database',
    icon: 'restaurant_menu',
    to: '/recipes',
  },
  {
    label: 'Calculator',
    caption: 'Product calculator',
    icon: 'calculate',
    to: '/calculator',
  },
  {
    label: 'Fridge',
    caption: 'What is in the fridge?',
    icon: 'kitchen',
    to: '/fridge',
  },
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
