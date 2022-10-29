import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '../product.model';
import { IncreaseCartTotalProducts } from '../state/product.actions';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() product!: Product;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  addToCart(){
    this.store.dispatch(new IncreaseCartTotalProducts());
  }

}
