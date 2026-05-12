import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-customize-columns-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        DragDropModule,
        FormsModule
    ],
    templateUrl: './customize-columns-dialog.component.html',
    styleUrls: ['./customize-columns-dialog.component.scss']
})
export class CustomizeColumnsDialogComponent {
    columns: { name: string, label: string, visible: boolean }[] = [];
    selectedIndex: number | null = null;

    constructor(
        public dialogRef: MatDialogRef<CustomizeColumnsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { columns: { name: string, label: string, visible: boolean }[] }
    ) {
        this.columns = data.columns.map(c => ({ ...c }));
    }

    selectItem(index: number): void {
        this.selectedIndex = index;
    }

    moveUp(): void {
        if (this.selectedIndex !== null && this.selectedIndex > 0) {
            const item = this.columns[this.selectedIndex];
            this.columns.splice(this.selectedIndex, 1);
            this.columns.splice(this.selectedIndex - 1, 0, item);
            this.selectedIndex--;
        }
    }

    moveDown(): void {
        if (this.selectedIndex !== null && this.selectedIndex < this.columns.length - 1) {
            const item = this.columns[this.selectedIndex];
            this.columns.splice(this.selectedIndex, 1);
            this.columns.splice(this.selectedIndex + 1, 0, item);
            this.selectedIndex++;
        }
    }

    canMoveUp(): boolean {
        return this.selectedIndex !== null && this.selectedIndex > 0;
    }

    canMoveDown(): boolean {
        return this.selectedIndex !== null && this.selectedIndex < this.columns.length - 1;
    }

    onSave(): void {
        this.dialogRef.close(this.columns);
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
