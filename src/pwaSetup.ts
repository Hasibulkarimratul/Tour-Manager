// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // Could show a toast, but auto Update is good for standalone.
    },
    onOfflineReady() {
      console.log('App is ready to work offline');
    },
  });
}
