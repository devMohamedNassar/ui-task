import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { ProductsComponent } from "./products/products.component";

const routes: Route[] = [
  {component: ProductsComponent, path: ""},
  {component: ProductsComponent, path: "cat/:catName"},
  {component: ProductsComponent, path: "search/:query"},
  {path: "cat", redirectTo: ""},
  {path: "search", redirectTo: ""}
]; 

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule {}