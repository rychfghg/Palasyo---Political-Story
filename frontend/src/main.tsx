import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from '@/app/router/AppRouter';
import '@/app/styles/global.css';
import '@/app/styles/office.css';
import '@/app/styles/refresh/index.css';
import { applyPrefs } from '@/shared/utils/prefs';

applyPrefs();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);

// Fade out the loading screen once the game has drawn (a timer too, since hidden tabs skip frames).
const hideBoot = () => {
  const boot = document.getElementById('boot');
  if (!boot || boot.classList.contains('is-done')) return;
  boot.classList.add('is-done');
  setTimeout(() => boot.remove(), 400);
};
requestAnimationFrame(hideBoot);
setTimeout(hideBoot, 300);
