import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';

export interface Result {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'https://dummyjson.com/products';
  constructor(private httpClient: HttpClient) { }

  getAllProducts(limit: number = 30, skip: number = 0): Observable<Result>{
    return this.httpClient.get<Result>(this.productsUrl, {params: {limit, skip}});
  }

  getAllCats(): Observable<string[]>{
    return this.httpClient.get<string[]>(this.productsUrl + '/categories');
  }

  getProductsOfCats(catName: string): Observable<Result>{
    return this.httpClient.get<Result>(`${this.productsUrl}/category/${catName}`);
  }

  searchProducts(query: string): Observable<Result>{
    return this.httpClient.get<Result>(`${this.productsUrl}/search?q=${query}`);
  }
}
