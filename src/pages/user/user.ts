import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, LoadingController , ToastController, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage'
import { BaseUi } from '../../common/baseui';
import { RestProvider } from '../../providers/rest/rest';
import { HeadfacePage } from '../headface/headface'

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage extends BaseUi{
  
  // headface : string = "http://10.172.246.85/flower/imgs/avatar/emoji/emoji_1.jpg?";
  headface : string = "http://www.laiwenge.com/imgs/avatar/emoji/emoji_1.jpg?";
  nickname : string = "加载中...";
  phone : string ;
  vipName : string ;
  vipIcon : string ;
  credits : string ;
  discount : string ;
  email : string ;
  address : string ;
  gender : string ;
  uname : string ;

  errorMessage : any;

  constructor(public navCtrl: NavController,
    public navparams: NavParams,
    public modalCtrl: ModalController,
    public loadCtrl: LoadingController,
    public rest: RestProvider,
    public viewCtrl : ViewController,
    public toastCtrl: ToastController,
    public storage: Storage) {
    super()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  ionViewDidEnter() {  //生命周期 => 页面加载完之后
    this.loadUserPage();
  }

  loadUserPage() {
    this.storage.get("userId").then((val) => {
      if (!val) {
        //如果用户登录了,加载用户数据
        var loading = super.showLoading(this.loadCtrl, "加载中...")
        this.rest.getUserInfo(val)
          .subscribe(userinfo => {  //加载成功
            console.log(this.nickname);
            console.log(this.headface);
            
            this.nickname = userinfo["nickname"];
            // this.headface = "http://127.0.0.1/flower/imgs/avatar/" + userinfo["avatar"] + ".jpg";
            this.headface = "http://www.laiwenge.com/flower/imgs/avatar/" + userinfo["avatar"] ;
            this.phone = userinfo["phone"];
            this.vipName = userinfo["name"];
            this.vipIcon = userinfo["avatar_url"];
            this.credits = userinfo["credits"];
            this.discount = userinfo["discount"]==100?"没有折扣优惠":(userinfo["discount"]/10)+"折";
            this.address = userinfo["address"];
            this.email = userinfo["email"];
            this.uname = userinfo["uname"];
            this.gender = userinfo["gender"]?"男":"女";
            // this.headface = userinfo["UserHeadface"] + "?" + (new Date().valueOf())

            loading.dismiss()
          },error => this.errorMessage = <any>error)
      }
    })
  }

  updateNickName(){//更新用户昵称
    this.storage.get('userId').then((val) => {
      if (val != null) {
        var loading = super.showLoading(this.loadCtrl, "修改中...");
        this.rest.updateNickName(val, this.nickname)
          .subscribe(
          f => {
            if (f["status"] == true) {
              loading.dismiss();
              super.showToast(this.toastCtrl, f["msg"]);
            }
            else {
              loading.dismiss();
              super.showToast(this.toastCtrl, f["msg"]);
            }
          },
          error => this.errorMessage = <any>error);
      }
    });
  }

  logout(){//用户注销
    this.storage.remove('userId');
    this.viewCtrl.dismiss();
  }

  gotoHeadface(){ //跳转到更换头像
    this.navCtrl.push(HeadfacePage)
  }

}
