import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from '@/app/router/AppRouter';
import '@/app/styles/global.css';
import '@/app/styles/office.css';
import '@/app/styles/refresh.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
