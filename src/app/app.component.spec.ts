import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Subscription, take } from 'rxjs';
import { AppComponent } from './app.component';
import { IncreaseCartTotalProducts, LoadCatProducts, LoadProductsSearch } from './products/state/product.actions';
import { testModuleConfig } from './test-helper';


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      ...testModuleConfig,
      declarations: [
        AppComponent
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'freshnesecom'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('freshnesecom');
  });

  it('should get cats', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'onSelectCat');
    app.cats$.subscribe(cats => expect(cats).toContain("smartphones"));
    app.loadingCats$.subscribe(loading => expect(loading).toBeFalsy())
    app.catName = "smartphones";
    fixture.detectChanges();
    tick();
    const compiled = fixture.nativeElement as HTMLElement;
    const selectElem = compiled.querySelector<HTMLSelectElement>('.cats-search-box__all-cats')!;

    selectElem.dispatchEvent(new Event('ngModelChange'));
    fixture.detectChanges();
    expect(app.onSelectCat).toHaveBeenCalled();

    expect(selectElem.value).toEqual("smartphones");

    expect(selectElem.querySelectorAll('option')[0].value).toBeFalsy();
    expect(selectElem.querySelectorAll('option')[1].value).toBeTruthy();
  }));

  it('should get cart total products', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.cartTotalProducts$.pipe(take(1)).subscribe(total => expect(total).toEqual(0));
    app.store.dispatch(new IncreaseCartTotalProducts())
    app.cartTotalProducts$.subscribe(total => expect(total).toEqual(1));
  });

  it('should query and cat name updated', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.store.dispatch(new LoadProductsSearch('query'));
    app.store.dispatch(new LoadCatProducts('catName'));
    tick();
    expect(app.query).toEqual('query');
    expect(app.catName).toEqual('catName');
  }))

  it('should subscription created', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.subscription).toBeInstanceOf(Subscription);
  })

  it('should search events triggered', (() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'updateSearchQuery');
    spyOn(app, 'onKeyPress');
    const compiled = fixture.nativeElement as HTMLElement;
    const searchInput = compiled.querySelector<HTMLSelectElement>('.cats-search-box__input-wrap input')!;
    const searchIcon = compiled.querySelector<HTMLSelectElement>('.cats-search-box__input-wrap img')!;
    searchInput.dispatchEvent(new Event('keypress'));
    searchIcon.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(app.onKeyPress).toHaveBeenCalled();
    expect(app.updateSearchQuery).toHaveBeenCalled();
  }))

  it('should navigate called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app.router, 'navigate');
    app.onSelectCat('catName');
    expect(app.router.navigate).toHaveBeenCalledWith(['cat', 'catName']);
    app.onSelectCat("");
    expect(app.router.navigate).toHaveBeenCalledWith(['/']);
    app.query = 'query';
    app.updateSearchQuery();
    expect(app.router.navigate).toHaveBeenCalledWith(['search', 'query']);
  })

  it('should update search query if hit enter', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'updateSearchQuery');
    app.onKeyPress(<KeyboardEvent>{key: 'enter'});
    expect(app.updateSearchQuery).toHaveBeenCalled();
  })

});
