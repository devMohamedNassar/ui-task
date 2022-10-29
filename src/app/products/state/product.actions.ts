import { Action } from '@ngrx/store';
import { Page, Product } from '../product.model';

export enum ProductActionTypes {
  LOAD_PRODUCTS = 'load products',
  LOAD_PRODUCTS_SUCCESS = 'load products success',
  LOAD_PRODUCTS_FAIL = 'load products fail',
  LOAD_NEXT_PAGE_PRODUCTS = 'load next page products',
  LOAD_NEXT_PAGE_PRODUCTS_SUCCESS = 'load next page products success',
  LOAD_NEXT_PAGE_PRODUCTS_FAIL = 'load next page products fail',
  LOAD_CATS = 'load cats',
  LOAD_CATS_SUCCESS = 'load cats success',
  LOAD_CATS_FAIL = 'load cats fail',
  LOAD_CAT_PRODUCTS = 'load cat products',
  LOAD_CAT_PRODUCTS_SUCCESS = 'load cat products success',
  LOAD_CAT_PRODUCTS_FAIL = 'load cat products fail',
  LOAD_PRODUCTS_SEARCH = 'load products search',
  LOAD_PRODUCTS_SEARCH_SUCCESS = 'load products search success',
  LOAD_PRODUCTS_SEARCH_FAIL = 'load products search fail',
  INCREASE_CART_TOTAL_PRODUCTS = 'increase cart total products',
}

export class LoadProducts implements Action {
  readonly type = ProductActionTypes.LOAD_PRODUCTS;
}
export class LoadProductsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_PRODUCTS_SUCCESS;
  constructor(public payload: { products: Product[]; total: number }) {}
}
export class LoadProductsFail implements Action {
  readonly type = ProductActionTypes.LOAD_PRODUCTS_FAIL;
}

export class LoadNextPageProducts implements Action {
  readonly type = ProductActionTypes.LOAD_NEXT_PAGE_PRODUCTS;
  constructor(public payload: { skip: number; limit: number }) {}
}
export class LoadNextPageProductsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_NEXT_PAGE_PRODUCTS_SUCCESS;
  constructor(
    public payload: {
      Products: Product[];
      skip: number;
      limit: number;
      total: number;
    }
  ) {}
}
export class LoadNextPageProductsFail implements Action {
  readonly type = ProductActionTypes.LOAD_NEXT_PAGE_PRODUCTS_FAIL;
  constructor() {}
}

export class LoadCats implements Action {
  readonly type = ProductActionTypes.LOAD_CATS;
}
export class LoadCatsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_CATS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadCatsFail implements Action {
  readonly type = ProductActionTypes.LOAD_CATS_FAIL;
}

export class LoadCatProducts implements Action {
  readonly type = ProductActionTypes.LOAD_CAT_PRODUCTS;
  constructor(public payload: string) {}
}
export class LoadCatProductsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_CAT_PRODUCTS_SUCCESS;
  constructor(public payload: { catName: string; products: Product[] }) {}
}
export class LoadCatProductsFail implements Action {
  readonly type = ProductActionTypes.LOAD_CAT_PRODUCTS_FAIL;
}

export class LoadProductsSearch implements Action {
  readonly type = ProductActionTypes.LOAD_PRODUCTS_SEARCH;
  constructor(public payload: string) {}
}
export class LoadProductsSearchSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_PRODUCTS_SEARCH_SUCCESS;
  constructor(public payload: { products: Product[]; total: number }) {}
}
export class LoadProductsSearchFail implements Action {
  readonly type = ProductActionTypes.LOAD_PRODUCTS_SEARCH_FAIL;
}

export class IncreaseCartTotalProducts implements Action {
  readonly type = ProductActionTypes.INCREASE_CART_TOTAL_PRODUCTS;
}

export type ProductActions =
  | LoadProducts
  | LoadProductsSuccess
  | LoadProductsFail
  | LoadNextPageProducts
  | LoadNextPageProductsSuccess
  | LoadNextPageProductsFail
  | LoadCats
  | LoadCatsSuccess
  | LoadCatsFail
  | LoadCatProducts
  | LoadCatProductsSuccess
  | LoadCatProductsFail
  | LoadProductsSearch
  | LoadProductsSearchSuccess
  | LoadProductsSearchFail
  | IncreaseCartTotalProducts;
