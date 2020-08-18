import {Component} from '@angular/core';
import {interval, Observable, of, timer} from 'rxjs';
import {delay, map, switchMap, take} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rxjs-learning';

  public simpleStringObservable(): Observable<string> {
    // of is an Observable that emits the arguments provided and then completes.
    // https://rxjs-dev.firebaseapp.com/api/index/function/of
    return of('hello world');
  }

  public mutatedStringObservable(): Observable<string> {
    // A Pipeable Operator is a function that takes an Observable as its input and
    // returns another Observable. It is a pure operation: the previous Observable
    // stays unmodified.
    // https://rxjs-dev.firebaseapp.com/guide/operators

    // We create an observable that returns the string 'hello world'
    return of('hello world')
      // Pipe that observable into
      .pipe(
        // the map operator, which takes an input value and returns a modified value
        map(a => a.replace('world', 'foo'))
      );
  }

  // takeOperatorObservable takes a specified number of values, and multiplies each
  // value by 10
  public takeOperatorObservable(howMany: number): Observable<number> {
    // Create an observable with the following values
    return of(1, 2, 3, 4, 5, 6, 7)
      .pipe(
        // take the first 'howMany' values
        take(howMany),
        // multiply each value times 10
        map(n => n * 10),
        // what gets returned here is the last value put through this pipeline
      );
  }

  public switchMapObservable(): Observable<number> {
    // Returns an Observable that emits items based on applying a function that you supply
    // to each item emitted by the source Observable, where that function returns an
    // (so-called "inner") Observable. Each time it observes one of these inner Observables,
    // the output Observable begins emitting the items emitted by that inner Observable.
    // When a new inner Observable is emitted, switchMap stops emitting items from the
    // earlier-emitted inner Observable and begins emitting items from the new one. It
    // continues to behave like this for subsequent inner Observables.
    // https://rxjs-dev.firebaseapp.com/api/operators/switchMap
    //
    // Create a first observable that will just emit a 10
    const firstObservable: Observable<number> = of(10);
    // Create a second observable that will emit the values, 1, 2, 3, and 4 consecutively
    const secondObservable: Observable<number> = of(1, 2, 3, 4);
    // Return a new observable constructed by piping the first observable
    return firstObservable
      // Take one value from firstObservable (in this case 10)
      .pipe(
        // this is similar to map in that we process each value from firstObservable through
        // a mapping function, the difference here is that the mapping function is another
        // observable (secondObservable). We'll be taking the value 10 (firstObservable) and
        // passing it through each value in the secondObservable (1, 2, 3, 4), multiplying 10
        // by each of them, and adding the result to itself.
        //
        // Notice how the result is 20 which is the equivalent of taking 10 + (1, 2, 3, 4)
        switchMap((n: number) => {
          // Return the value of n after adding each value of secondObservable
          return secondObservable.pipe(map(i => {
            // Set n = to n (10) + i (1, 2, 3, 4)
            n = n + i;
            return n;
          }));
        })
      );
  }

  // So how does the above example actually translate to the real world? Lets say in order to
  // calculate the cost of an order, we need to add on the sales tax, and lets say that we get
  // that sales tax through an API. One option (the traditional option) would be to just do it
  // in steps
  //
  //    salesTax = http.Get('3rdparty/salestax')
  //    orderTotal = http.Get('my-api/ordertotal')
  //    totalWithTax = orderTotal * salesTax
  //    return totalWithTax
  //
  // The more reactive (rxjs) approach to solving this problem is using the switch map
  public realWorldSwitchMapObservable(): Observable<number> {
    // Create a fake observable that will mock the 2rd party sales tax api
    const salesTaxApi = of(1.25);
    // Create a fake observable that will mock our api that returns an order total
    const ourApiOrderTotal = of(125);
    // Return a new observable that calculates the total order cost by piping the
    // sales tax into our api
    return salesTaxApi
      // Get the sales tax
      .pipe(
        // switch the output of the current observable to be the response from the
        // ourApiOrderTotal observable
        switchMap(salesTax => ourApiOrderTotal
          // We want to return the total cost + sales tax so lets pipe the total
          // out of the ourApiOrderTotal observable and map each value (there will
          // only be one in this case) to equal the input value times the sales tax
          .pipe(
            map(cost => cost * salesTax)
          )
        )
      );
  }
}
