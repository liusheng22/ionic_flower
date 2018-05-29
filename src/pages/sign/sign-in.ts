import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { StatusBar } from ''

@Component({
  selector: 'sign-in',
  templateUrl: 'sign-in.html'
})
export class SignInPage {

  constructor(public navCtrl: NavController) {
    // StatusBar.isVisible //是否已经显示
    // StatusBar.hide(); //隐藏状态栏
    // StatusBar.show(); //显示状态栏
    // StatusBar.backgroundColorByHexString("#C0C0C0"); //设置背景色
    // StatusBar.backgroundColorByName("red");  //使用名称设置背景色
  }
//   module.controller('MyCtrl', function($cordovaStatusbar) {
//     $cordovaStatusbar.overlaysWebView(true);
  
//     $cordovaStatusbar.style(1);
  
//     $cordovaStatusbar.styleColor('black');
  
//     $cordovaStatusbar.styleHex('#000');
  
//     $cordovaStatusbar.hide();
  
//     $cordovaStatusbar.show();
  
//     var isVisible = $cordovaStatusbar.isVisible();
  
//   });

}
