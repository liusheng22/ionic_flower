import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, ToastController, ActionSheetController, Platform, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { RestProvider } from '../../providers/rest/rest';
import { BaseUi } from '../../common/baseui';
import { RegisterPage } from '../register/register';
import {FormGroup,FormControl} from '@angular/forms';
import { AddAddressPage } from '../add-address/add-address'

@IonicPage()
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage extends BaseUi {
  uid : string ;
  pidList = [];
  errorMessage : string ;
  address : string ;
  langs;
  langForm;
  delivery;
  userInfo = [];
  productInfo = [];

  constructor(public navCtrl: NavController,
    public loadCtrl : LoadingController,
    public toastCtrl : ToastController,
    public actionSheetCtrl : ActionSheetController,
    public storage : Storage,
    public rest : RestProvider,
    public alertCtrl: AlertController,
    public platform : Platform,
    public navParams: NavParams) {
      super();
      this.langForm = new FormGroup({
        "langs": new FormControl({value: 'Alipay', disabled: false})
      });
  }

  ionViewDidLoad() {
    this.pidList = this.navParams.get('pid');
    this.uid = this.navParams.get('uid');

    this.storage.get("userId").then((val) => {
      if(val != null) { //验证是否登陆,如果用户登录了,加载 商品信息
        var loading = this.showLoading(this.loadCtrl , "不要着急,加载中...");
        this.uid = val;

        this.pdAddress(val);
        this.loadPageInfo(val);
        loading.dismiss()
      }else{  //如果没有登陆,跳转到 登陆 页
        this.navCtrl.push(RegisterPage,{
          status:'noLogin'
        });
      }
    })
  }

  ionViewWillEnter(){ //生命周期 => 当页面即将进入并成为活动页面时运行。
    console.log('')
  }

  ionViewDidEnter(){  //当进入页面时触发
    this.rest.hideTabs();
  }  
  ionViewWillLeave(){  //当将要从页面离开时触发
    this.rest.showTabs();
  }

  doSubmit(event) {
    event.preventDefault();
    console.log('Submitting form', this.langForm.value);
  }

  loadPageInfo(uid){
    this.rest.getUserInfo(uid).subscribe(res=>{ //
      console.log(res)
      if(res['status']){
        this.userInfo = res;
      }else{
        super.showToast(this.toastCtrl,'用户信息不存在');
      }
    })

    this.pidList.forEach((v,i)=>{
      this.rest.productInfo(v).subscribe(res=>{
        console.log(res['0'])
        if(res.length){
          this.productInfo.push(res['0']);
          // this.productInfo = (res);
          console.log(this.productInfo)
        }else{
          super.showToast(this.toastCtrl,'商品信息不存在');
        }
      })
    })
    
  }

  pdAddress(uid){
    this.rest.address(uid,0,0,0).subscribe( res=>{
      console.log(res);
      if(res['status']){  //如果有收货地址,则获取其地址
        this.address = res['msg'];
        this.rest.hideTabs();
      }else{  //如果没有收货地址
        let actionSheet = this.actionSheetCtrl.create({ //弹出confirm选择框
          title: res['msg'] ,
          buttons: [
            {
              text: '朕这就前往',
              icon: 'pin' ,
              // role: 'destructive',
              handler: () => {
                this.navCtrl.push(AddAddressPage,{uid:this.uid}); //跳到添加地址页面
              }
            },{
              text: '朕还没想好要买',
              role: 'cancel',
              icon: 'close',
              handler: () => {
                this.rest.showTabs();
                this.navCtrl.pop();
                // this.rest.showTabs();
              }
            }
          ]
        });
        actionSheet.present();
      }
    }, error => this.errorMessage = <any>error)
  }

}
