import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, filter, of, Subscription } from 'rxjs';
import { ProductService } from './products/product.service';
import { LoadCats, LoadProducts } from './products/state/product.actions';
import { getCartTotalProducts, getCats, getCurrentCatName, getLoadingCats, getSearchQuery } from './products/state/product.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'freshnesecom';
  cats$ = this.store.pipe(select(getCats));
  loadingCats$ = this.store.pipe(select(getLoadingCats));
  catName = "";
  query = "";
  cartTotalProducts$ = this.store.pipe(select(getCartTotalProducts));
  subscription = new Subscription();

  constructor(
    public store: Store,
    public router: Router
  ) {
    store.dispatch(new LoadCats());
    this.subscription.add(
      combineLatest([
        this.store.pipe(select(getSearchQuery)),
        this.store.pipe(select(getCurrentCatName))
      ])
      .subscribe(([query, catName]) => {
        setTimeout(() => {
          this.query = query;
          this.catName = catName;
        })
      })
    );
  }

  onSelectCat(cat: string) {
    if (!cat) this.router.navigate(['/']);
    else this.router.navigate(['cat', cat]);
  }

  updateSearchQuery(){
    this.router.navigate(['search', this.query]);
  }

  onKeyPress(e: KeyboardEvent){
    if(e.key.toLocaleLowerCase() === 'enter'){
      this.updateSearchQuery();
    }
  }
}
