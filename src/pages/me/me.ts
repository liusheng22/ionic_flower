import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage'
import { BaseUi } from '../../common/baseui';
import { RestProvider } from '../../providers/rest/rest';
import { UserPage} from '../../pages/user/user';
import { SettingProvider } from '../../providers/setting/setting';
import { ScanPage } from '../../pages/scan/scan';

@Component({
  selector: 'page-me',
  templateUrl: 'me.html'
})
export class MePage extends BaseUi {

  public notLogin: boolean = true;
  public logined: boolean = false;
  headface: string;
  selectTheme : string ;
  userinfo: string[];

  constructor(public navCtrl: NavController,
    public navparams: NavParams,
    public modalCtrl: ModalController,
    public loadCtrl: LoadingController,
    public rest: RestProvider,
    public settings : SettingProvider ,
    public storage: Storage) {
      super() ;
      this.settings.getActiveTheme().subscribe(val=>{
        this.selectTheme = val;
      })
  }

  ionViewDidEnter() {  //生命周期 => 页面加载完之后
    this.loadUserPage();
  }

  loadUserPage() {
    this.storage.get("userId").then((val) => {
      if (val != null) {
        //如果用户登录了,加载用户数据
        var loading = super.showLoading(this.loadCtrl, "加载中...")
        this.rest.getUserInfo(val)
          .subscribe(userinfo => {  //加载成功
            this.userinfo = userinfo;
            // this.headface = userinfo["avatar"] + "?" + (new Date().valueOf())
            // this.headface = "http://10.172.246.85/flower/imgs/avatar" + userinfo["avatar"] + ".jpg"
            this.headface = "http://www.laiwenge.com/flower/imgs/avatar/" + userinfo["avatar"] + ".jpg"
            this.notLogin = false;
            this.logined = true;
            loading.dismiss()
          })
      } else {
        this.notLogin = true;
        this.logined = false;
      }
    })
  }

  showSign() {
    let modal = this.modalCtrl.create(LoginPage)
    //关闭页面后的回调
    modal.onDidDismiss(()=>{  //让副页面刷新，不会登录成功后还停留在登录面板，
      this.loadUserPage()   //因为modal关闭时，不会再次触发ionViewDidEnter周期函数了
    })
    modal.present();
  }

  jumpUserPage(){
    this.navCtrl.push(UserPage);
  }

  cutTheme(){
    if(this.selectTheme == 'night-theme'){
      this.settings.setActiveTheme('light-theme')
    }else{
      this.settings.setActiveTheme('night-theme')
    }
  }

  goToScanQRCode(){
    this.navCtrl.push(ScanPage,null,{'animate':false})
  }

}
