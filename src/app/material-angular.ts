import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatExpansionModule,
  MatInputModule
} from '@angular/material';

@NgModule({
  imports: [
    MatToolbarModule,
    MatExpansionModule,
    MatInputModule
  ],
  exports: [
    MatToolbarModule,
    MatExpansionModule,
    MatInputModule
  ],
})
export class MaterialAngular { }
