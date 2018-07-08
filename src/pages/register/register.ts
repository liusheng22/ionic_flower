import { Component } from '@angular/core';
import { NavController, NavParams, ViewController , LoadingController , ToastController } from 'ionic-angular';
import { BaseUi } from '../../common/baseui';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage extends BaseUi{
  
  mobile : any ;
  nickname : any ;
  password : any;
  gender : any =1;
  confirmPwd : any;
  errorMessage : any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public loadingCtrl : LoadingController,
    public toastCtrl : ToastController,
    public rest : RestProvider) {
      super() //一定要记得调用
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  dismiss(){
    this.viewCtrl.dismiss()
  }

  genders(){
    console.log(this.gender)
  }

  doRegister(){
    //前后验证数据的正确性，包括手机号，昵称，密码 长度及正确性
    if((!(/^1[34578]\d{9}$/).test(this.mobile))){ //验证国内手机号码格式 
      //这里可以进行大数据的保存，作为分析
      super.showToast(this.toastCtrl,"您的手机号码格式不正确")
    }else if(this.nickname.length<3 || this.nickname.length>10){
      super.showToast(this.toastCtrl,"昵称的长度应该在3~10位之间")
    }else if(this.password.length<6 || this.password.length>20 || this.confirmPwd.length<6 || this.confirmPwd.length>20){
      super.showToast(this.toastCtrl,"密码的长度应该在6~20位之间")
    }else if(this.password !== this.confirmPwd){
      super.showToast(this.toastCtrl,"两次输入的密码不正确")
    }else{
      var loading = super.showLoading(this.loadingCtrl,"注册中...")
      this.rest.register(this.mobile,this.nickname,this.password,this.gender)
        .subscribe(f=>{
          console.log(f)
          if(f["status"]==true){  //注册成功
            loading.dismiss()
            super.showToast(this.toastCtrl,f["msg"])
            this.dismiss()  //关闭当前页面
          }else{  //注册失败
            loading.dismiss()
            super.showToast(this.toastCtrl,f["msg"])
          }
        },error => this.errorMessage = <any>error );
    }
  } //注册-end

  returnLogin(){
    this.navCtrl.pop()
  } //返回loagin

}
