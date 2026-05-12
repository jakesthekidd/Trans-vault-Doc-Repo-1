import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CustomizeColumnsDialogComponent } from '../../components/customize-columns-dialog/customize-columns-dialog.component';
import { ExceptionPillComponent } from '../../components/exception-pill/exception-pill.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Document {
  id: number;
  docNumber: string;
  systemJck?: string;
  commResults?: string;
  approved?: string;
  transferredStatus?: string;
  receiptAmount?: string;
  systemIndex?: string;
  poNumber?: string;
  refMatch?: string;
  docType: string;
  loadNumber: string;
  carrierInvoice: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: string;
  carrierName: string;
  status: string;
  /** Field-level exceptions (expected vs. evaluated value mismatches). */
  exceptions?: string[];
  /** Document holds preventing approval. */
  documentHolds?: string[];
}

const MOCK_DATA: Document[] = [
  { id: 1, docNumber: '22227795-23689514', systemJck: '88053505', commResults: '0954734', approved: 'Yes', transferredStatus: 'COMPLETED', receiptAmount: '$2,450.00', systemIndex: 'INVDIFW9128', poNumber: '01/20/2026', refMatch: 'Y', docType: 'CARRIER INVOICE', loadNumber: '24992690', carrierInvoice: '21', invoiceNumber: 'INVDIFW9128', invoiceDate: '2026-01-20', invoiceAmount: '$2,450.00', carrierName: 'AVP TRANSPORT INC.', status: 'APPROVED', exceptions: ['Invoice Amount', 'Bill To Name', 'Carrier Name'], documentHolds: [] },
  { id: 2, docNumber: '22226092-23689504', systemJck: '88045584', commResults: '0952887', approved: 'No', transferredStatus: 'REMIT TO NOT MATCHED', receiptAmount: '$3,400.00', systemIndex: '952887', poNumber: '01/20/2026', refMatch: 'N', docType: 'CARRIER INVOICE', loadNumber: '24992691', carrierInvoice: '22', invoiceNumber: '952887', invoiceDate: '2026-01-20', invoiceAmount: '$3,400.00', carrierName: 'HARPERS HOT SHOT TRUCKING', status: 'PENDING', exceptions: ['Invoice Number'], documentHolds: ['Missing Documents!'] },
  { id: 3, docNumber: '22228567-23689173', systemJck: '88056854', commResults: '0956218', approved: 'No', transferredStatus: 'ORDER NOT ON FILE', receiptAmount: '$3,250.00', systemIndex: '225537', poNumber: '01/20/2026', refMatch: 'N', docType: 'CARRIER INVOICE', loadNumber: '24992692', carrierInvoice: '23', invoiceNumber: '225537', invoiceDate: '2026-01-20', invoiceAmount: '$3,250.00', carrierName: 'CTI', status: 'REJECTED', exceptions: ['Invoice Amount', 'Remit To Name'], documentHolds: ['Missing Documents!', 'Field Errors Not Resolved'] },
  { id: 4, docNumber: '22225796-23688970', systemJck: '88044275', commResults: '0954918', approved: 'Pending', transferredStatus: 'FOR REVIEW', receiptAmount: '$1,500.00', systemIndex: '148317', poNumber: '01/20/2026', refMatch: 'Y', docType: 'CARRIER INVOICE', loadNumber: '24992693', carrierInvoice: '24', invoiceNumber: '148317', invoiceDate: '2026-01-20', invoiceAmount: '$1,500.00', carrierName: 'FREIGHTSTAR EXPEDITED, LLC', status: 'PENDING', exceptions: ['Remit To Name'], documentHolds: [] },
];

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatTooltipModule,
    ExceptionPillComponent
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'view',
    'actions',
    'docType',
    'exceptions',
    'documentHolds',
    'invoiceNumber',
    'invoiceDate',
    'invoiceAmount',
    'carrierName',
    'systemJck',
    'commResults',
    'transferredStatus',
    'receiptAmount',
    'systemIndex',
    'poNumber',
    'refMatch',
    'loadNumber',
    'carrierInvoice',
    'status'
  ];

  filterColumns: string[] = this.displayedColumns.map(c => c + '_filter');
  operatorsTooltip = 'Supported operators are: =, !=, >, <, >=, <=';

  dataSource = new MatTableDataSource<Document>(MOCK_DATA);
  selection = new SelectionModel<Document>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  showThumbnails = false;
  filterRowVisible = false;
  columnFilters: { [key: string]: string } = {
    docType: '',
  };
  isLoading = false;
  private loadingTimeout: any;

  hoveredRow: Document | null = null;
  thumbTop = '0px';
  thumbLeft = '0px';
  thumbLoading = false;
  sampleThumbUrl = 'https://placehold.co/300x400/f0f2f5/2c95dd?text=Document+Preview';
  private thumbTimeout: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  fetchData() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    // Simulate API delay
    this.loadingTimeout = setTimeout(() => {
      this.isLoading = false;
      this.loadingTimeout = null;
      this.cdr.detectChanges();
    }, 600); // Shorter for better UX while still simulating "prep"
  }

  toggleFilterRow(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.filterRowVisible = !this.filterRowVisible;
  }

  getStart() {
    const p = this.paginator;
    if (!p) return 1;
    return (p.pageIndex * p.pageSize) + 1;
  }

  getEnd() {
    const p = this.paginator;
    if (!p) return this.dataSource.data.length;
    const end = (p.pageIndex + 1) * p.pageSize;
    return Math.min(end, this.dataSource.data.length);
  }

  previousPage() {
    if (this.paginator?.hasPreviousPage()) {
      this.paginator.previousPage();
      this.fetchData();
    }
  }

  nextPage() {
    if (this.paginator?.hasNextPage()) {
      this.paginator.nextPage();
      this.fetchData();
    }
  }

  pageSizeChanged(event: any) {
    if (this.paginator) {
      this.paginator.pageSize = +event.target.value;
      (this.paginator as any)._changePageSize(this.paginator.pageSize);
      this.fetchData();
    }
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }

  refreshPage() {
    this.fetchData(); // Trigger loader simulation instead of full page reload
  }

  applyFilters() {
    const filters = Object.keys(this.columnFilters)
      .map(key => `${key}:${this.columnFilters[key]}`)
      .filter(f => !f.endsWith(':') && !f.endsWith(':='))
      .join(',');

    this.dataSource.filter = filters;
    this.fetchData(); // Trigger loader on filter apply
  }

  showThumbnail(event: MouseEvent, row: Document) {
    if (this.thumbTimeout) { clearTimeout(this.thumbTimeout); }

    this.hoveredRow = row;
    this.thumbTop = (event.clientY + 10) + 'px';
    this.thumbLeft = (event.clientX + 20) + 'px';
    this.thumbLoading = true;

    this.thumbTimeout = setTimeout(() => {
      this.thumbLoading = false;
      this.cdr.detectChanges();
    }, 400); // Quick simulation of fetch
  }

  hideThumbnail() {
    this.hoveredRow = null;
    this.thumbLoading = false;
    if (this.thumbTimeout) {
      clearTimeout(this.thumbTimeout);
      this.thumbTimeout = null;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  openViewer(docId: number) {
    this.router.navigate(['/viewer', docId]);
  }

  openCustomizeColumns() {
    const dialogRef = this.dialog.open(CustomizeColumnsDialogComponent, {
      width: '500px',
      data: {
        columns: this.displayedColumns.slice(3).map(c => ({
          name: c,
          label: c.replace(/([A-Z])/g, ' $1').trim(),
          visible: true
        }))
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
        // The data is "re-fetched", so we update the columns
        const baseColumns = this.displayedColumns.slice(0, 3);
        const customizedColumns = result
          .filter((c: any) => c.visible)
          .map((c: any) => c.name);

        this.displayedColumns = [...baseColumns, ...customizedColumns];
        this.filterColumns = this.displayedColumns.map(c => c + '_filter');
      }
    });
  }

  // Row and Toolbar Actions
  exportIndexToCsv() { console.log('Export document index to CSV/TSV'); }
  exportSelectedDocs() { console.log('Export selected docs'); }
  emailSelectedDocs() { console.log('Email selected docs'); }
  toggleThumbnailView() { this.showThumbnails = !this.showThumbnails; }

  // Row Menu Actions
  rowOpen(row: any) { this.openViewer(row.id); }
  rowPrint(row: any) { console.log('Printing', row); }
  rowEmail(row: any) { console.log('Emailing', row); }
  rowDelete(row: any) { console.log('Deleting', row); }
  rowExportCold(row: any) { console.log('Export COLD', row); }
  rowSubmitOcr(row: any) { console.log('Submit OCR', row); }
  rowAdHoc(row: any) { console.log('Ad Hoc Search', row); }
}