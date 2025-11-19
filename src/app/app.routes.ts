import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'qrcode-generation',
    loadChildren: () => import('./qrcode-generation/qrcode-generation.routes').then(m => m.QrcodeGenerationRoutes)
  },
  {
    path: '',
    redirectTo: 'qrcode-generation',
    pathMatch: 'full'
  }
];
