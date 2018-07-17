import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatExpansionModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatCardModule
} from '@angular/material';

@NgModule({
  imports: [
    MatToolbarModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [
    MatToolbarModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
})
export class MaterialAngular { }
