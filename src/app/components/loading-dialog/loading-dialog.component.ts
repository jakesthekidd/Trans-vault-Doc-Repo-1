import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-loading-dialog',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule, MatDialogModule],
    template: `
    <div class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
      <span>Searching... please wait</span>
    </div>
  `,
    styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px;
      gap: 20px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      color: #333;
    }
  `]
})
export class LoadingDialogComponent { }
