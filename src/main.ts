import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';  // Correct: AppComponent, not App

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));