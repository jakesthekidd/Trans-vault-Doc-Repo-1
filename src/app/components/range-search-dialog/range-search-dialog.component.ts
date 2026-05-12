import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-range-search-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './range-search-dialog.component.html',
    styleUrls: ['./range-search-dialog.component.scss']
})
export class RangeSearchDialogComponent {
    comparisonType: string = 'Between';
    value1: string = '';
    value2: string = '';

    comparisons = ['Between', 'Equal', 'Not Equal', 'Greater Than', 'Less Than'];

    constructor(
        public dialogRef: MatDialogRef<RangeSearchDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onCancel(): void {
        this.dialogRef.close();
    }

    onOk(): void {
        this.dialogRef.close({
            type: this.comparisonType,
            value1: this.value1,
            value2: this.value2
        });
    }
}
