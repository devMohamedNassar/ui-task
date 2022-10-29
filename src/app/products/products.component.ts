import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Page, Product } from './product.model';
import {
  LoadCatProducts,
  LoadNextPageProducts,
  LoadProducts,
  LoadProductsSearch,
} from './state/product.actions';
import {
  getCatsProducts,
  getProducts,
  getProductsLoading,
  getProductsPage,
  getSearchProducts,
} from './state/product.reducer';
import { map, Observable, Subscription, tap } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products$!: Observable<Product[]>;
  loading$ = this.store.pipe(select(getProductsLoading));
  noResultsFound = false;
  private page!: Page;
  private subscription = new Subscription();
  @ViewChild('loadingElem') loadingElem!: ElementRef<HTMLElement>;
  @HostListener('window:scroll') onScroll() {
    if (this.page.isLastPage || !this.isHome) return;
    const elem = this.loadingElem.nativeElement;
    const isInViewport = this.isElementInViewport(elem);
    const isLoading = !!+elem.style.opacity;
    if (isInViewport && !isLoading) this.loadMore();
  }

  constructor(
    private store: Store,
    @Inject(DOCUMENT) private document: Document,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.isHome) this.store.dispatch(new LoadProducts());
    this.subscription.add(
      this.store
        .pipe(select(getProductsPage))
        .subscribe((page) => (this.page = page))
    );
    this.subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        const catName = params?.['catName'];
        const query = params?.['query'];
        if (catName) this.getCatProducts(catName);
        else if (query) this.getSearchProducts(query);
        else this.products$ = this.store.pipe(select(getProducts));
      })
    );
  }

  private get isHome() {
    const params = this.activatedRoute.snapshot.params;
    return !params?.['catName'] && !params?.['query'];
  }

  private getCatProducts(catName: string) {
    this.store.dispatch(new LoadCatProducts(catName));
    this.products$ = this.store
      .pipe(select(getCatsProducts))
      .pipe(map((catsProducts) => catsProducts[catName]));
  }

  private getSearchProducts(query: string) {
    this.noResultsFound = false;
    this.store.dispatch(new LoadProductsSearch(query));
    this.products$ = this.store.pipe(
      select(getSearchProducts),
      tap((products) => (this.noResultsFound = !products.length))
    );
  }

  private loadMore() {
    const skip = (this.page.pageIndex + 1) * this.page.limit;
    this.store.dispatch(
      new LoadNextPageProducts({ limit: this.page.limit, skip })
    );
  }

  private isElementInViewport(elem: HTMLElement) {
    const rect = elem.getBoundingClientRect();
    return (
      rect.bottom >= 0 && rect.top <= this.document.documentElement.clientHeight
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
