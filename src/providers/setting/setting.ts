import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

/*
  Generated class for the SettingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingProvider {

  private theme : BehaviorSubject<string>

  constructor(public http: Http) {
    this.theme = new BehaviorSubject('light-theme')
  }

  setActiveTheme(val){  //当前激活的 theme
    this.theme.next(val);
  }

  getActiveTheme(){
    return this.theme.asObservable();
  }

}
