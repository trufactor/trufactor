# Trufactor Client Library
The trufactor client library helps communication with the trufactor data access layer by providing a few different functions:
1. Combine frontend cache with supplementary data calls
2. Provide a progress percentage to track a request
3. Strategize requests based on filters, zoom and geometric queries

## Getting Started
Adding the trufactor frontend library is very simple. Merely
```
npm i @trufactor/core --save
```
You can then leverage the trufactor api, here is a simple example:
```
import {Trufactor} from '@trufactor/core';

const db = new Trufactor();

db.getData().then(data=>{
  console.log('The default data is a Kansas City hexagon:',data);
});
```

## Trufactor Client Library API

### Accessible properties
* **queuedRequests** Array holding AbortableController instances to cancel any requests in flight
* **progress** Numerical value where `0` means an indeterminate value (strategy request in flight) and any other numerical value represents a percent as a Number between `1` and `100`.

### Accessible methods
* **Trufactor.cacheData** Private method used by class to cache chunks of data at a time.
* **Trufactor.updateProgress** Private method used by class to update the numerical progress
* **Trufactor.getData** Public method used to make calls to trufactor data access layer it will return the completed data as one chunk. Alternatively to waiting on the whole data payload, one may override `beforeCaching` or `afterCaching` methods to receive data partials as they return.
  * **query** (Optional) Single dimensional array of lat/long pairs. Can be point, line or polygon
  * **zoom** (Optional) Decimal value of type Number that is a normalized representation of a zoom level between 0 and 1 where 0 is completely zoomed out and 1 is completely zoomed in. As an example, in the mapbox library there are 22 levels of zoom so 22 would be 1 here.
  * **filters** (Optional) Object containing all demographic values (age,gender,ethnicity,income) with filter values of String type for each, representing demographic filter criteria.
    * **age** filter can be: `default` (Anything), `18to25`, `26to35`, `36to45`, `46to55`, `56to65`, `66to75`, `76plus`
    * **gender** filter can be: `default` (Anything), `male`, `female`
    * **ethnicity** filter can be `default` (Anything), `american indian`, `asian or pacific islander`, `black`, `hispanic`, `white`, `multiracial`
    * **income** filter can be `default` (Anything), `0to15k`, `15to25k`, `25to35k`, `35to50k`, `50to75k`, `75to100k`, `100to125k`, `125to150k`, `150to175k`, `175kplus`

### Overridable methods
There are some functions that are lifecycle hooks that can be leveraged to get data as its coming back to render it in partial, or merely override as the needs of the application requires.
* **Trufactor.beforeStrategy** public overridable method that is called at the beginning of the `getData` method. It must be a synchronous function.
* **Trufactor.afterStrategy** public overridable method that is called at the beginning of the `getData` method but before any of the chunks are made. It is passed the payload of the strategy request. It must be a synchronous function.
* **Trufactor.beforeCaching** public overridable method that is passed data as it comes back in chunks. It must be a synchronous function.
* **Trufactor.afterCaching** public overridable method that is passed data as it comes back in chunks. It must be a synchronous function.
* **Trufactor.beforeSupplementary** public overridable method that is passed the entirity of data before any supplementary calls are made. It must be a synchronous function.
* **Trufactor.afterSupplementary** public overridable method that is passed the entire payload after all supplementary calls are made. The payload will be the same as the `getData` calls results. It fires immediately before the `getData` result is returned. It must be a synchronous function.

