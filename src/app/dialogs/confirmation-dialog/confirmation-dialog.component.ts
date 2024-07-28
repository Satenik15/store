import { Component, Inject, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { IProduct } from '../../models/product.interface';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgIf],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent  {
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  private productsService = inject(ProductsService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: IProduct) { }

  onDeleteProduct() {
    this.productsService.deleteProduct(this.data.id)
      .subscribe(_ => this.dialogRef.close(true));
  }
}
