import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    PdfViewerModule,
  ],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss',
})
export class ViewerComponent {
  docId: string | null;
  // multi-page support (3 images)
  images = [
    'https://picsum.photos/id/10/1000/1400',
    'https://picsum.photos/id/11/1000/1400',
    'https://picsum.photos/id/12/1000/1400'
  ];
  imageSrc = this.images[0];
  zoom = 1.0;
  rotation = 0;
  totalPages = this.images.length;
  currentPage = 1;

  isModifyMode = false;
  isSidebarOpened = true;
  sidebarWidth = 400; // Default width in px
  isResizing = false;
  showAnnotationTools = false; // Hidden by default
  showFormatTools = false;     // Hidden by default
  showSubMenu = false;         // Hidden by default
  isLoading = false;
  Math = Math;

  // Panning State
  isPanMode = false;
  isPanning = false;
  startX = 0;
  startY = 0;
  scrollLeft = 0;
  scrollTop = 0;

  metadata: any = {
    loadNumber: '3136878',
    docType: 'EMAIL',
    invoiceNumber: '3136878',
    invoiceDate: '11/26/2025',
    invoiceAmount: '$640.00',
    carrierName: 'J.B. HUNT',
    carrierZip: '72745',
    remitToName: 'CARRIER PAYABLES',
    remitToZip: '72745',
    systemSource: 'AB456-90',
    emailFrom: 'billing@jbhunt.com',
    transfloStatus: 'COMPLETED',
    systemDcn: 'DCN-99812-X',
    systemPageId: 'P001',
    systemReceivedDate: '2025-11-26',
    systemLoadedDate: '2026-01-26 16:49:16',
    systemAxwmId: 'AX-10293',
    systemCompletedBy: 'B. SMITH',
    systemCompletedDate: '2026-01-26',
    dataCarrierName: 'JB HUNT TRANSPORT',
    dataCarrierZip: '72745',
    dataRemitToName: 'CARRIER PAYABLES',
    dataRemitToZip: '72745',
    dataTonu: 'NO',
    dataLumper: '0.00',
    dataPodReq: 'YES',
    dataAccessorial: '0.00',
    dataCarrierId: 'JBHT-01',
    dataCustomerId: 'CUST-100',
    dataTruckloadStatus: 'DELIVERED',
    dataTotalCost: '1250.00',
    dataQp: 'N/A',
    dataBulk: 'NO',
    bolWeight: '42000',
    scaleWeight: '41980',
    confNum: '8877221',
    dataCustomerName: 'WALMART INC',
    enteredInTmw: 'YES'
  };

  fields = [
    { key: 'loadNumber', label: 'LOAD NUMBER', required: true },
    { key: 'docType', label: 'DOC TYPE', required: true },
    { key: 'invoiceNumber', label: 'INVOICE NUMBER' },
    { key: 'invoiceDate', label: 'INVOICE DATE' },
    { key: 'invoiceAmount', label: 'INVOICE AMOUNT' },
    { key: 'carrierName', label: 'CARRIER NAME' },
    { key: 'carrierZip', label: 'CARRIER ZIP' },
    { key: 'remitToName', label: 'REMIT TO NAME' },
    { key: 'remitToZip', label: 'REMIT TO ZIP' },
    { key: 'systemSource', label: 'SYSTEM_SOURCE' },
    { key: 'emailFrom', label: 'EMAIL FROM' },
    { key: 'transfloStatus', label: 'TRANSFLO STATUS' },
    { key: 'systemDcn', label: 'SYSTEM_DCN', required: true },
    { key: 'systemPageId', label: 'SYSTEM_PAGEID' },
    { key: 'systemReceivedDate', label: 'SYSTEM_RECEIVED_DATE' },
    { key: 'systemLoadedDate', label: 'SYSTEM_LOADED_DATE', required: true },
    { key: 'systemAxwmId', label: 'SYSTEM_AXWMID' },
    { key: 'systemCompletedBy', label: 'SYSTEM_COMPLETED_BY' },
    { key: 'systemCompletedDate', label: 'SYSTEM_COMPLETED_DATE' },
    { key: 'dataCarrierName', label: 'DATA_CARRIER_NAME' },
    { key: 'dataCarrierZip', label: 'DATA_CARRIER_ZIP' },
    { key: 'dataRemitToName', label: 'DATA_REMIT_TO_NAME' },
    { key: 'dataRemitToZip', label: 'DATA_REMIT_TO_ZIP' },
    { key: 'dataTonu', label: 'DATA_TONU' },
    { key: 'dataLumper', label: 'DATA_LUMPER' },
    { key: 'dataPodReq', label: 'DATA_POD_REQ' },
    { key: 'dataAccessorial', label: 'DATA_ACCESSORIAL' },
    { key: 'dataCarrierId', label: 'DATA_CARRIER_ID' },
    { key: 'dataCustomerId', label: 'DATA_CUSTOMER_ID' },
    { key: 'dataTruckloadStatus', label: 'DATA_TRUCKLOAD_STATUS' },
    { key: 'dataTotalCost', label: 'DATA_TOTAL_COST' },
    { key: 'dataQp', label: 'DATA_QP' },
    { key: 'dataBulk', label: 'DATA_BULK' },
    { key: 'bolWeight', label: 'BOLWEIGHT' },
    { key: 'scaleWeight', label: 'SCALEWEIGHT' },
    { key: 'confNum', label: 'CONFNUM' },
    { key: 'dataCustomerName', label: 'DATA_CUSTOMER_NAME' },
    { key: 'enteredInTmw', label: 'ENTERED_IN_TMW' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.docId = this.route.snapshot.paramMap.get('id');
  }

  toggleModify() {
    if (this.isModifyMode) {
      this.saveMetadata();
    }
    this.isModifyMode = !this.isModifyMode;
  }

  toggleSidebar() {
    this.isSidebarOpened = !this.isSidebarOpened;
  }

  saveMetadata() {
    console.log('Modified Metadata saved:', this.metadata);
  }

  goBack() {
    this.router.navigate(['/results']);
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }

  rotate(deg: number) {
    this.rotation += deg;
  }

  // Navigation Logic
  firstPage() {
    this.goToPage(1);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  lastPage() {
    this.goToPage(this.totalPages);
  }

  goToPage(page: any) {
    const pageNum = parseInt(page, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.totalPages) {
      if (this.currentPage !== pageNum) {
        this.isLoading = true;
        this.currentPage = pageNum;
        this.imageSrc = this.images[pageNum - 1];
      }
    }
  }

  onImageLoad() {
    this.isLoading = false;
  }

  // Zoom Fit Logic
  fitWidth() {
    this.zoom = 1.2; // Fixed ratio for demonstration
  }

  fitHeight() {
    this.zoom = 0.8; // Fixed ratio for demonstration
  }

  fitToView() {
    this.zoom = 1.0;
  }

  togglePanMode() {
    this.isPanMode = !this.isPanMode;
  }

  onResizerMouseDown(event: MouseEvent) {
    this.isResizing = true;
    event.preventDefault();
  }

  onViewportMouseDown(event: MouseEvent) {
    if (!this.isPanMode) return;
    this.isPanning = true;
    const viewport = event.currentTarget as HTMLElement;
    this.startX = event.pageX - viewport.offsetLeft;
    this.startY = event.pageY - viewport.offsetTop;
    this.scrollLeft = viewport.scrollLeft;
    this.scrollTop = viewport.scrollTop;
    event.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing) {
      // Calculate new width relative to the right side of the window
      const newWidth = window.innerWidth - event.clientX;

      // Constraints: min 200px, max 80% of window width
      if (newWidth > 200 && newWidth < window.innerWidth * 0.8) {
        this.sidebarWidth = newWidth;
      }
    } else if (this.isPanning) {
      const viewport = document.querySelector('.viewport-canvas') as HTMLElement;
      if (!viewport) return;
      const x = event.pageX - viewport.offsetLeft;
      const y = event.pageY - viewport.offsetTop;
      const walkX = (x - this.startX);
      const walkY = (y - this.startY);
      viewport.scrollLeft = this.scrollLeft - walkX;
      viewport.scrollTop = this.scrollTop - walkY;
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isResizing = false;
    this.isPanning = false;
  }
}