import { computed } from 'vue';
import { useQuasar } from 'quasar';

export function useMediaBreakpoints() {
  const $q = useQuasar();

  const isDesktop = computed(() => $q.screen.gt.sm); // 1024px <=
  const isTablet = computed(() => $q.screen.sm); // 640px <= && < 1024px
  const isMobile = computed(() => $q.screen.lt.sm); // < 640px

  return {
    isDesktop,
    isTablet,
    isMobile,
  };
}
