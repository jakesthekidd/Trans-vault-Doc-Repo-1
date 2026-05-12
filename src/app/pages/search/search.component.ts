import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ListSearchDialogComponent } from '../../components/list-search-dialog/list-search-dialog.component';
import { RangeSearchDialogComponent } from '../../components/range-search-dialog/range-search-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { SearchService } from '../../services/search.service';
import {
  FIELD_EXCEPTION_OPTIONS,
  DOCUMENT_HOLD_OPTIONS,
} from '../../shared/exception-options';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDatepickerModule,
    MatInputModule, MatFormFieldModule, MatIconModule,
    MatButtonModule, MatNativeDateModule, MatDialogModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup = new FormGroup({});

  fields: Array<{
    label: string;
    controlName: string;
    type: string;
    placeholder?: string;
    options?: string[];
  }> = [
    { label: 'LOAD NUMBER', controlName: 'loadNumber', type: 'text' },
    { label: 'DOC TYPE', controlName: 'docType', type: 'select_multiple', placeholder: 'Multiple select / Input and enter' },
    { label: 'EXCEPTIONS', controlName: 'exceptions', type: 'select_multiple', placeholder: 'Select one or more exceptions', options: FIELD_EXCEPTION_OPTIONS },
    { label: 'DOCUMENT HOLDS', controlName: 'documentHolds', type: 'select_multiple', placeholder: 'Select one or more holds', options: DOCUMENT_HOLD_OPTIONS },
    { label: 'INVOICE NUMBER', controlName: 'invoiceNumber', type: 'text' },
    { label: 'INVOICE DATE', controlName: 'invoiceDate', type: 'date' },
    { label: 'INVOICE AMOUNT', controlName: 'invoiceAmount', type: 'text' },
    { label: 'CARRIER NAME', controlName: 'carrierName', type: 'text' },
    { label: 'CARRIER ZIP', controlName: 'carrierZip', type: 'text' },
    { label: 'REMIT TO NAME', controlName: 'remitToName', type: 'text' },
    { label: 'REMIT TO ZIP', controlName: 'remitToZip', type: 'text' },
    { label: 'SHIP DATE', controlName: 'shipDate', type: 'date' },
    { label: 'DELIVERY DATE', controlName: 'deliveryDate', type: 'date' },
    { label: 'RECEIPT AMOUNT', controlName: 'receiptAmount', type: 'text' },
    { label: 'PO NUMBER', controlName: 'poNumber', type: 'text' },
    { label: 'REF_MATCH', controlName: 'refMatch', type: 'text' },
    { label: 'REF NUMBER', controlName: 'refNumber', type: 'text' },
    { label: 'EMAIL FROM', controlName: 'emailFrom', type: 'text' },
    { label: 'SYSTEM_DCN', controlName: 'systemDcn', type: 'text' },
    { label: 'SYSTEM_PAGEID', controlName: 'systemPageId', type: 'text' },
    { label: 'SYSTEM_RECEIVED_DATE', controlName: 'systemReceivedDate', type: 'date' }
  ];

  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.fields.forEach(f => this.searchForm.addControl(f.controlName, new FormControl('')));

    // Load persisted state
    const saved = this.searchService.getCriteria();
    if (saved && Object.keys(saved).length > 0) {
      this.searchForm.patchValue(saved, { emitEvent: false });
    }

    // Auto-save changes
    this.searchForm.valueChanges.subscribe(val => {
      this.searchService.setCriteria(val);
    });
  }

  openListSearch(name: string) {
    const field = this.fields.find(f => f.controlName === name);
    const current = this.searchForm.get(name)?.value;
    const values = this.parseSelected(current);

    const ref = this.dialog.open(ListSearchDialogComponent, {
      width: '550px',
      data: {
        title: field?.label ? field.label + ' — List Search' : 'List Search',
        options: field?.options,
        values,
      },
    });

    ref.afterClosed().subscribe((result: string[] | undefined) => {
      if (result) {
        // Store selected values as a comma-separated string so they fit the
        // existing string-based form-control / persistence model.
        this.searchForm.get(name)?.setValue(result.join(', '));
      }
    });
  }

  /** Parse a stored form value (string or string[]) into a string[]. */
  private parseSelected(raw: unknown): string[] {
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === 'string' && raw.trim()) {
      return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }

  openRangeSearch(name: string) {
    this.dialog.open(RangeSearchDialogComponent, {
      width: '450px',
      data: { fieldName: name }
    });
  }

  onRun() {
    console.log('Searching:', this.searchForm.value);
    this.isLoading = true;

    // Save state before run
    this.searchService.setCriteria(this.searchForm.value);

    // Open Loading Dialog
    const loadingDialogRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
      panelClass: 'loading-dialog-panel'
    });

    // Simulate backend request
    setTimeout(() => {
      this.isLoading = false;
      loadingDialogRef.close();

      const loadNum = this.searchForm.get('loadNumber')?.value;

      // Simulate 0 results if loadNumber is '0'
      if (loadNum === '0') {
        this.dialog.open(AlertDialogComponent, {
          width: '400px',
          data: {
            title: 'AppEnhancer Web Access',
            message: 'No document found.',
            type: 'info'
          }
        });
      } else {
        this.router.navigate(['/results']);
      }
    }, 2000);
  }

  onSave() { console.log('Saving search criteria...'); }
  onReset() {
    this.searchForm.reset();
    this.searchService.clear();
  }
}