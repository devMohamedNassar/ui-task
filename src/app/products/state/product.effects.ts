import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import {
  catchError,
  combineLatest,
  concatMap,
  map,
  Observable,
  of,
  take,
} from 'rxjs';
import { ProductService } from '../product.service';
import {
  LoadCatProducts,
  LoadCatProductsFail,
  LoadCatProductsSuccess,
  LoadCats,
  LoadCatsFail,
  LoadCatsSuccess,
  LoadNextPageProducts,
  LoadNextPageProductsFail,
  LoadNextPageProductsSuccess,
  LoadProducts,
  LoadProductsFail,
  LoadProductsSearch,
  LoadProductsSearchFail,
  LoadProductsSearchSuccess,
  LoadProductsSuccess,
  ProductActionTypes,
} from './product.actions';
import {
  getCatsProducts,
  getProducts,
  getTotalProducts,
} from './product.reducer';

@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private productService: ProductService,
    private store: Store
  ) {}

  loadProducts$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadProducts>(ProductActionTypes.LOAD_PRODUCTS),
      concatMap((action) =>
        combineLatest([
          this.store.pipe(take(1), select(getProducts)),
          this.store.pipe(take(1), select(getTotalProducts)),
        ])
      ),
      concatMap(([products, total]) => {
        if (products?.length) return of({ products, total });
        else return this.productService.getAllProducts();
      }),
      map(
        (result) =>
          new LoadProductsSuccess({
            products: result.products,
            total: result.total,
          })
      ),
      catchError((err) => of(new LoadProductsFail()))
    )
  );

  loadNextPageProducts$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadNextPageProducts>(ProductActionTypes.LOAD_NEXT_PAGE_PRODUCTS),
      concatMap((action) =>
        this.productService.getAllProducts(
          action.payload.limit,
          action.payload.skip
        )
      ),
      map(
        (result) =>
          new LoadNextPageProductsSuccess({
            Products: result.products,
            limit: result.limit,
            skip: result.skip,
            total: result.total,
          })
      ),
      catchError((err) => of(new LoadNextPageProductsFail()))
    )
  );

  loadCats$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadCats>(ProductActionTypes.LOAD_CATS),
      concatMap((action) => this.productService.getAllCats()),
      map((result) => new LoadCatsSuccess(result)),
      catchError((err) => of(new LoadCatsFail()))
    )
  );

  loadCatProducts$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadCatProducts>(ProductActionTypes.LOAD_CAT_PRODUCTS),
      concatMap((action) =>
        this.store.pipe(
          take(1),
          select(getCatsProducts),
          map((data) => ({
            products: data[action.payload],
            catName: action.payload,
          }))
        )
      ),
      concatMap(({ products, catName }) => {
        if (products) return of({ products, catName });
        else
          return this.productService
            .getProductsOfCats(catName)
            .pipe(map((result) => ({ products: result.products, catName })));
      }),
      map(
        ({ products, catName }) =>
          new LoadCatProductsSuccess({ catName, products })
      ),
      catchError((err) => of(new LoadCatProductsFail()))
    )
  );

  loadSearchProducts$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LoadProductsSearch>(ProductActionTypes.LOAD_PRODUCTS_SEARCH),
    concatMap(action => this.productService.searchProducts(action.payload)),
    map(result => new LoadProductsSearchSuccess({products: result.products, total: result.total})),
    catchError(err => of(new LoadProductsSearchFail()))
  ))
}
