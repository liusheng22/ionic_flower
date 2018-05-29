import { Component } from '@angular/core';
import { NavController , NavParams  } from 'ionic-angular';
import { App } from 'ionic-angular';
import {ToastController} from "ionic-angular";
import { HomePage } from '../home/home';
// import { StatusBar } from ''

@Component({
  selector: 'sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  User = {
    name:"",
    pwd:""
  }

  constructor(public navCtrl: NavController, public app:App , public navParams:NavParams ,public toastController: ToastController ) {
    // StatusBar.isVisible //是否已经显示
    // StatusBar.hide(); //隐藏状态栏
    // StatusBar.show(); //显示状态栏
    // StatusBar.backgroundColorByHexString("#C0C0C0"); //设置背景色
    // StatusBar.backgroundColorByName("red");  //使用名称设置背景色
    console.log(app);
    console.log(toastController);
    var elem = document.querySelectorAll(".tabbar")
    console.log(elem);
    if(elem || null ){//页面初始化时，隐藏tabs
      Object.keys(elem).map((key)=>{
        elem[key].style.display = "none"
      })
    }
    
  }//constructor-end

  // goBack() {//返回
  //     console.log("back")
  //     this.navCtrl.push(HomePage);
  // }

  ionViewWillLeave(){//
    let elements = document.querySelectorAll(".tabbar");
    if (elements != null) {
        Object.keys(elements).map((key) => {
            elements[key].style.display = 'flex';
        });
    }
  }

  Signup(){
    sessionStorage.setItem("uname",this.User.name)
    sessionStorage.setItem("upwd",this.User.pwd)
    this.User.name = sessionStorage.getItem("uname")
    this.User.pwd = sessionStorage.getItem("upwd")
    console.log(this.User.name,this.User.pwd);
    
    if(this.User.name && this.User.pwd){
      this.navCtrl.push(HomePage,{
        id:0,
        name:"HomePage"
      });
    }
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
