import { Routes } from '@angular/router';

export const QrcodeGenerationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./qrcode-generation.component').then(m => m.QrcodeGenerationComponent)
  }
];

