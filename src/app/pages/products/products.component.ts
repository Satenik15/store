import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProductsService } from '../../services/products.service';
import { IProduct } from '../../models/product.interface';
import { DialogModeType } from '../../models/dialog-mode.type';
import { DialogMode } from '../../models/dialog-mode.enum';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { AddProductDialogComponent } from '../../dialogs/add-product-dialog/add-product-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTableModule, 
    MatPaginatorModule, 
    MatIconModule, 
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  readonly dialog = inject(MatDialog);
  
  private destroy$: Subject<void> = new Subject();
  
  public productsService = inject(ProductsService);
  public displayedColumns: string[] = ['id', 'sku', 'name', 'cost', 'actions'];
  public dataSource = new MatTableDataSource<IProduct>();
  public DialogMode = DialogMode;

  ngOnInit(): void {
    this.getProductsList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProductsList() {
    this.productsService.getProductsList().subscribe(data => {
      if (data) {
        this.dataSource.data = data;
      }
    })
  }

  openDeleteProductDialog(product: IProduct) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe((deleted: boolean) => {
      if(deleted) {
        this.getProductsList();
      }
    })
  }

  openAddProductDialog(mode: DialogModeType, product: IProduct | null = null) {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '1000px',
      data: {
        ...product,
        mode
      }
    });


    dialogRef.afterClosed().subscribe((product: IProduct) => {
      if(product) {
        this.getProductsList();
      }
    })
  }
}
