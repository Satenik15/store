import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, FormGroupDirective, NgForm, FormArray } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { ProductsService } from '../../services/products.service';
import { INewProduct } from '../../models/new-product.model';
import { IProduct } from '../../models/product.interface';
import { IDialogData } from '../../models/dialog-data.model';
import { DialogMode } from '../../models/dialog-mode.enum';
import { ICustomProperty } from '../../models/custom-property.model';
import { IEditProduct } from '../../models/edit-product.model';

@Component({
  selector: 'app-add-product-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleCasePipe,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './add-product-dialog.component.html',
  styleUrl: './add-product-dialog.component.scss'
})
export class AddProductDialogComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<AddProductDialogComponent>);
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);

  private destroy$: Subject<void> = new Subject();

  public form!: FormGroup;
  public DialogMode = DialogMode;
  public backdropValue!: number;

  public profiles: any[] = [
    { value: 'furniture', name: 'Furniture' },
    { value: 'equipment', name: 'Equipment' },
    { value: 'stationary', name: 'Stationary' },
    { value: 'part', name: 'Part' }
  ];

  get properties() {
    return this.form.get('properties') as FormArray;
  }

  get customProperties() {
    return this.form.get('customProperties') as FormArray;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogData) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      sku: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      profile: ['furniture', Validators.required],
      available: [true],
      backlog: [''],
      properties: this.fb.array([]),
      customProperties: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.data.mode !== DialogMode.add && this.data.profile) {
      this.form.patchValue({
        name: this.data.name,
        description: this.data.description,
        sku: this.data.sku,
        cost: this.data.cost,
        profile: this.data.profile.type,
        available: this.data.profile.available,
        backlog: this.data.profile.backlog,
      })

      if(this.data.profile.backlog) {
        this.backdropValue = this.data.profile.backlog
      }

      const { type, available, backlog, ...properties } = this.data.profile;

      for (const [key, value] of Object.entries(properties)) {
        const property = this.fb.group({
          key: [key],
          value: [value]
        });

        this.customProperties.push(property);
      }
    }

    if (this.data.mode === DialogMode.view) {
      this.form.disable();
    }

    this.form.controls['backlog']
                .valueChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe(val => {
                  this.backdropValue = +val;
                });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCreateProduct() {
    if (this.form.invalid) {
      return
    }

    const newProperties: ICustomProperty | any = {};

    this.properties.value.forEach((item: ICustomProperty) => {
      newProperties[item.propertyName] = item.propertyValue
    })

    const body: INewProduct | IEditProduct = {
      name: this.form.value.name,
      description: this.form.value.description,
      cost: this.form.value.cost,
      profile: {
        ...newProperties,
        type: this.form.value.profile,
        available: this.form.value.available,
        backlog: this.form.value.backlog
      }
    };

    if (this.data.mode !== DialogMode.add) {
      const editedCustomProperties: ICustomProperty | any = {};

      this.customProperties.value.forEach((item: { [key: string]: string }) => {
        editedCustomProperties[item['key']] = item['value']
      })

      body.profile = {
        ...body.profile,
        ...editedCustomProperties
      };

      this.productsService.editeProduct(this.data.id as number, body)
        .subscribe((product: IProduct) => {
          this.dialogRef.close(product);
        });

    } else {

      (body as INewProduct).sku = this.form.value.sku,

        this.productsService.createProduct(body as INewProduct)
          .subscribe((product: IProduct) => {
            this.dialogRef.close(product);
          });
    }
  }

  addItem() {
    const property = this.fb.group({
      propertyName: ['', Validators.required],
      propertyValue: ['', Validators.required],
    });

    this.properties.push(property);
  }

  removeProperty(items: FormArray, index: number) {
    items.removeAt(index);
  }
}
