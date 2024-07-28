import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { IProduct } from '../models/product.interface';
import { INewProduct } from '../models/new-product.model';
import { IEditProduct } from '../models/edit-product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading$.asObservable();

  private apiUrl = 'http://rest-items.research.cloudonix.io';

  constructor(private http: HttpClient) { }

  getProductsList(): Observable<IProduct[]> {
    this._loading$.next(true);
    return this.http.get<IProduct[]>(`${this.apiUrl}/items`)
      .pipe(tap(_ => this._loading$.next(false)))
  }

  createProduct(body: INewProduct): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.apiUrl}/items`, body)
  }

  editeProduct(id: number, body: IEditProduct): Observable<IProduct> {
    return this.http.patch<IProduct>(`${this.apiUrl}/items/${id}`, body)
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/items/${id}`)
  }
}
