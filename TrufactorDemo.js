import {debounce} from './debounce';
import demoData from './demo.json';

const defaultFilters = Object.freeze({
  age: 'default',
  gender: 'default',
  ethnicity: 'default',
  income: 'default'
});

export class TrufactorDemo{
  constructor({domain='demo'}={}){
    this.queuedRequests = [];
    this.progress = 0;
    this.domain = domain;
    console.info('Trufactor initialized in demo mode.');
    this.loaded = new Promise(resolve=>{
      this.datesAvailable = ['2019-04-07'];
      this.cognitiveToken = null;
      this.lastAvailableDate = '2019-04-07';
      this.selectedDate = '2019-04-07';
      this.selectedDateIndex = 0;
      console.info(`Trufactor initialized with latest date: ${this.lastAvailableDate}`);
      console.info(`Trufactor dates available: ${this.datesAvailable}`)
      setTimeout(()=> resolve(true),1000);
    });

    // if everything is cached this could be called thousands of times
    // in a millisecond, we debounce this so it doesn't bog down processing
    this.updateProgress = debounce(function updateProgress(progress){
      this.progress = progress*100;
    }.bind(this),50);
  }
  nextDate(){
    this.selectedDateIndex++;
    if(this.selectedDateIndex>this.datesAvailable.length-1){
      this.selectedDateIndex=0;
    } //end if
    this.selectedDate = this.datesAvailable[this.selectedDateIndex];
  }
  previousDate(){
    this.selectedDateIndex--;
    if(this.selectedDateIndex<0){
      this.selectedDateIndex=this.datesAvailable.length-1;
    } //end if
    this.selectedDate = this.datesAvailable[this.selectedDateIndex];
  }
  getPointsOfInterest(){
    throw new Error('getPointsOfInterest not available in demo mode.');
  }
  getAddress(){
    throw new Error('getAddress not available in demo mode.');
  }
  getFuzzy(){
    throw new Error('getFuzzy not available in demo mode.');
  }
  getSpeechToText(){
    throw new Error('getSpeecToText not available in demo mode.');
  }
  getTextToSpeech(){
    throw new Error('getTextToSpeech not available in demo mode.');
  }
  getIntent(){
    throw new Error('getIntent not available in demo mode.');
  }
  cacheData(){
    throw new Error('cacheData not available in demo mode.');
  }
  getStrategy(){
    throw new Error('getStrategy not available in demo mode.');
  }
  getIndexes(){
    throw new Error('getIndexes not available in demo mode.');
  }
  async getData(){
    await this.loaded;
    this.progress = 0;
    return new Promise(resolve=>{
      setTimeout(()=>{
        this.progress = 100;

        // we allow attaching of synchronous functions before the intial
        // getData call
        if(typeof this.beforeGetData === 'function') this.beforeGetData();

        // we allow attaching of synchronous functions before the intial
        // strategy call
        if(typeof this.beforeStrategy === 'function') this.beforeStrategy();

        // we allow attaching of synchronous functions in-between the
        // initial strategy call and the filling in of data
        if(typeof this.afterStrategy === 'function') this.afterStrategy(demoData);

        // we allow attaching of synchronous functions before the supplementary
        // data calls
        if(typeof this.beforeSupplementary === 'function') this.beforeSupplementary(demoData.features);

        // we allow attaching of synchronous functions before the
        // caching of data
        if(typeof this.beforeCaching === 'function') this.beforeCaching({features: demoData.features});

        // we allow attaching of synchronous functions after the
        // caching of data
        if(typeof this.afterCaching === 'function') this.afterCaching({features: demoData.features});

        // we allow attaching of synchronous functions after the supplementary
        // data calls
        if(typeof this.afterSupplementary === 'function') this.afterSupplementary(demoData);

        // we allow attaching of synchronous functions before the intial
        // strategy call
        if(typeof this.afterGetData === 'function') this.afterGetData(demoData);
        resolve(demoData);
      },1000);
    });
  }
}
