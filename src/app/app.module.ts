import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
 
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatToolbarModule,
  MatProgressBarModule
} from '@angular/material';
import { EvalAtManyProbesComponent } from './eval-at-many-probes/eval-at-many-probes.component';
import { BaseStationDialogComponent } from './base-station-dialog/base-station-dialog.component';

const appRoutes: Routes = [
  { path: 'ter', component: AppComponent },
  { path: '', redirectTo: 'ter', pathMatch:"full" }
];


@NgModule({
  declarations: [
    AppComponent,
    EvalAtManyProbesComponent,
    BaseStationDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes
    ),
    // Angular maps
    AgmCoreModule.forRoot({
      // Get your key at https://console.cloud.google.com/apis
      apiKey: 'YOUR_API_KEY'
    }),
    AgmJsMarkerClustererModule,
 
    // Material
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatProgressBarModule,

    // Flex-layout
    FlexLayoutModule
  ],
  providers: [],
  entryComponents: [EvalAtManyProbesComponent, BaseStationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
