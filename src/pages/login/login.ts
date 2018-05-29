import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, LoadingController, ToastController } from 'ionic-angular';
import { BaseUi } from '../../common/baseui';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BaseUi{
  formName = {
    til : ["手机号","密码"],
    type : ["text","password"]
  }
  mobile : any;
  password : any;
  errorMessage : any;
  conLatitude : any;
  conLongitude : any;
  latitude : any;
  longitude : any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams ,
    public viewCtrl : ViewController ,
    public loadingCtrl : LoadingController ,  
    public rest : RestProvider ,
    public toastCtrl : ToastController ,
    public geolocation : Geolocation ,
    public storage : Storage ) {
      super()   //调用父类的构造函数
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  /**
   * 关闭当前页面的方法
   * 
   * @memberof LoginPage
   */
  dismiss(){
    this.viewCtrl.dismiss();
  }

  async login(){
    await this.geolocation.getCurrentPosition()
      .then(resp => {  //获得用户 定位 经纬度
        console.log(resp)
          this.latitude = resp.coords.latitude
          this.longitude = resp.coords.longitude
      }).catch(error => {
        console.log('Error getting location : ', error);
      })

    let watch = this.geolocation.watchPosition();
      watch.subscribe(data => { //持续获得用户定位
          this.conLatitude = data.coords.latitude
          this.conLongitude = data.coords.longitude
      });

    var loading = super.showLoading(this.loadingCtrl , "登录中...")

    this.rest.login(this.mobile , this.password , this.latitude , this.longitude)
          .subscribe(
            f => {
              if(f["status"]){
                //处理登录成功的页面跳转
                this.storage.set("userId",f["userId"])  //也可选择存储接口返回的 token
                loading.dismiss()
                this.dismiss()
              }else{
                loading.dismiss()
                super.showToast(this.toastCtrl , f["msg"]);
              }
            },
            error => this.errorMessage = <any>error
          );
  }

  registerPage(){
    this.navCtrl.push(RegisterPage)
  }

}
