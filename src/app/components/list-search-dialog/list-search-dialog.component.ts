import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

export interface ListSearchDialogData {
  /** Optional title shown in the dialog header. */
  title?: string;
  /** Pre-selected values. */
  values?: string[];
  /**
   * When provided, the dialog renders as a multi-select picker over this
   * predefined list (with a filter input). When omitted, the dialog falls
   * back to its original freeform Add/Replace/Delete behavior.
   */
  options?: string[];
}

@Component({
  selector: 'app-list-search-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './list-search-dialog.component.html',
  styleUrls: ['./list-search-dialog.component.scss']
})
export class ListSearchDialogComponent {
  currentValue: string = '';
  selectedValues: string[] = [];

  /** Filter text for the options list (options-mode only). */
  optionsFilter: string = '';

  constructor(
    public dialogRef: MatDialogRef<ListSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListSearchDialogData
  ) {
    if (data?.values) {
      this.selectedValues = [...data.values];
    }
  }

  get hasOptions(): boolean {
    return !!this.data?.options && this.data.options.length > 0;
  }

  get title(): string {
    return this.data?.title || 'List Search';
  }

  get filteredOptions(): string[] {
    if (!this.hasOptions) return [];
    const q = this.optionsFilter.trim().toLowerCase();
    if (!q) return this.data.options!;
    return this.data.options!.filter(o => o.toLowerCase().includes(q));
  }

  isChecked(option: string): boolean {
    return this.selectedValues.includes(option);
  }

  toggleOption(option: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedValues.includes(option)) {
        this.selectedValues.push(option);
      }
    } else {
      this.selectedValues = this.selectedValues.filter(v => v !== option);
    }
  }

  // --- Freeform-mode actions (unchanged behavior) -------------------------

  add(): void {
    if (this.currentValue.trim()) {
      this.selectedValues.push(this.currentValue.trim());
      this.currentValue = '';
    }
  }

  replace(): void {
    if (this.currentValue.trim()) {
      this.selectedValues = [this.currentValue.trim()];
      this.currentValue = '';
    }
  }

  delete(): void {
    this.selectedValues.pop();
  }

  deleteAll(): void {
    this.selectedValues = [];
  }

  cancel(): void {
    this.dialogRef.close();
  }

  ok(): void {
    this.dialogRef.close(this.selectedValues);
  }
}
