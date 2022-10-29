import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { ProductService, Result } from "./products/product.service";
import { ProductEffects } from "./products/state/product.effects";
import { productReducer } from "./products/state/product.reducer";

const productService = {
  result: {
      products: [
        {
          "id": 1,
          "title": "iPhone 9",
          "description": "An apple mobile which is nothing like apple",
          "price": 549,
          "discountPercentage": 12.96,
          "rating": 4.69,
          "stock": 94,
          "brand": "Apple",
          "category": "smartphones",
          "thumbnail": "https://dummyjson.com/image/i/products/1/thumbnail.jpg",
          "images": [
              "https://dummyjson.com/image/i/products/1/1.jpg",
              "https://dummyjson.com/image/i/products/1/2.jpg",
              "https://dummyjson.com/image/i/products/1/3.jpg",
              "https://dummyjson.com/image/i/products/1/4.jpg",
              "https://dummyjson.com/image/i/products/1/thumbnail.jpg"
          ]
      }
      ],
      total: 1,
      skip: 0,
      limit: 30
    },
  getAllProducts(limit: number = 30, skip: number = 0): Observable<Result>{
    return of(this.result)
  },

  getAllCats(): Observable<string[]>{
    return of(["smartphones"])
  },

  getProductsOfCats(catName: string): Observable<Result>{
    const result = {...this.result, products: this.result.products.filter(item => item.category === catName)}
    return of(result);
  },

  searchProducts(query: string): Observable<Result>{
    return of(this.result);
  }
}

export const testModuleConfig = {
  imports: [
    BrowserModule,
    StoreModule.forRoot({ products: productReducer }),
    RouterModule.forRoot([]),
    EffectsModule.forRoot([ProductEffects]),
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {provide: ProductService, useValue: productService}
  ]
}