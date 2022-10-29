import { Action, createFeatureSelector, createSelector } from "@ngrx/store";
import { Page, Product } from "../product.model";
import { ProductActions, ProductActionTypes } from "./product.actions";

interface ProductState {
  products: Product[];
  loadingProducts: boolean;
  pageInfo: {
    pageIndex: number;
    isLastPage: boolean;
    limit: number;
    skip: number;
    total: number;
  }
  cats: string[];
  loadingCats: boolean;
  catsProducts: {[key: string]: Product[]};
  currentCat: string;
  search: {
    products: Product[],
    loading: boolean,
    query: string
  },
  cartTotalProducts: number
}

const initState: ProductState = {
  products: [],
  loadingProducts: false,
  pageInfo: {
    pageIndex: 1,
    isLastPage: false,
    limit: 30,
    skip: 0,
    total: 1
  },
  cats: [],
  loadingCats: false,
  catsProducts: {},
  currentCat: "",
  search: {
    loading: false,
    products: [],
    query: ""
  },
  cartTotalProducts: 0
};

export const PAGE_LIMIT = 30;

export function productReducer(state = initState, a: Action): ProductState{
  const action = <ProductActions>a;
  switch(action.type){
    case ProductActionTypes.LOAD_PRODUCTS: {
      return {
        ...state,
        loadingProducts: true,
        currentCat: "",
        search: {...state.search, query: ""}
      };
    }
    case ProductActionTypes.LOAD_PRODUCTS_SUCCESS: {
      const pageIndex = Math.ceil(state.pageInfo.skip / state.pageInfo.limit);
      const isLastPage = pageIndex + 1 === Math.ceil(action.payload.total / state.pageInfo.limit);
      return {
        ...state,
        products: action.payload.products,
        loadingProducts: false,
        pageInfo: {...state.pageInfo, total: action.payload.total, pageIndex, isLastPage}
      }
    }
    case ProductActionTypes.LOAD_PRODUCTS_FAIL: {
      return {
        ...state,
        loadingProducts: false
      }
    }

    case ProductActionTypes.LOAD_NEXT_PAGE_PRODUCTS: {
      return {...state, loadingProducts: true}
    }
    case ProductActionTypes.LOAD_NEXT_PAGE_PRODUCTS_SUCCESS: {
      const {Products, limit ,skip ,total} = action.payload;
      const pageIndex = Math.ceil(skip / limit);
      const isLastPage = pageIndex + 1 === Math.ceil(total / limit);
      return {
        ...state,
        products: [...state.products, ...Products],
        loadingProducts: false,
        pageInfo: {...state.pageInfo, limit, skip, total, pageIndex, isLastPage}
      }
    }
    case ProductActionTypes.LOAD_NEXT_PAGE_PRODUCTS_FAIL: {
      return {...state, loadingProducts: false}
    }

    case ProductActionTypes.LOAD_CATS: {
      return {...state, loadingCats: true}
    }
    case ProductActionTypes.LOAD_CATS_SUCCESS: {
      return {...state, cats: action.payload, loadingCats: false}
    }
    case ProductActionTypes.LOAD_CATS_FAIL: {
      return {...state, loadingCats: false}
    }

    case ProductActionTypes.LOAD_CAT_PRODUCTS: {
      return {...state, loadingProducts: true, currentCat: action.payload}
    }
    case ProductActionTypes.LOAD_CAT_PRODUCTS_SUCCESS: {
      return {...state, catsProducts: {...state.catsProducts, [action.payload.catName]: action.payload.products}, loadingProducts: false}
    }
    case ProductActionTypes.LOAD_CAT_PRODUCTS_FAIL: {
      return {...state, loadingProducts: false}
    }

    case ProductActionTypes.LOAD_PRODUCTS_SEARCH: {
      return {...state, search: {...state.search, loading: true, query: action.payload}, loadingProducts: true}
    }
    case ProductActionTypes.LOAD_PRODUCTS_SEARCH_SUCCESS: {
      return {...state, search: {...state.search, loading: false, products: action.payload.products}, loadingProducts: false}
    }
    case ProductActionTypes.LOAD_PRODUCTS_SEARCH_FAIL: {
      return {...state, search: {...state.search, loading: false}, loadingProducts: false}
    }

    case ProductActionTypes.INCREASE_CART_TOTAL_PRODUCTS: {
      return {...state, cartTotalProducts: state.cartTotalProducts + 1}
    }

    default: {
      return state;
    }
  }
}

const getProductsFeatureState = createFeatureSelector<ProductState>('products');
export const getProducts = createSelector(getProductsFeatureState, state => state.products);
export const getTotalProducts = createSelector(getProductsFeatureState, state => state.pageInfo.total);
export const getProductsLoading = createSelector(getProductsFeatureState, state => state.loadingProducts);
export const getProductsPage = createSelector(getProductsFeatureState, state => {
  const {isLastPage,limit,pageIndex,skip,total} = state.pageInfo;
  const page: Page = {isLastPage,limit,pageIndex,skip,total};
  return page;
});

export const getCats = createSelector(getProductsFeatureState, state => state.cats);
export const getLoadingCats = createSelector(getProductsFeatureState, state => state.loadingCats);

export const getCatsProducts = createSelector(getProductsFeatureState, state => state.catsProducts);
export const getCurrentCatName = createSelector(getProductsFeatureState, state => state.currentCat);

export const getSearchProducts = createSelector(getProductsFeatureState, state => state.search.products);
export const getSearchQuery = createSelector(getProductsFeatureState, state => state.search.query);

export const getCartTotalProducts = createSelector(getProductsFeatureState, state => state.cartTotalProducts);
