import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { RestProvider } from '../../providers/rest/rest';
import { BaseUi } from '../../common/baseui';
import { RegisterPage } from '../register/register';

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage extends BaseUi {
  pid : string;
  uid : string;
  comment : any;

  constructor(public navCtrl: NavController,
    public loadCtrl : LoadingController,
    public toastCtrl : ToastController,
    public storage : Storage,
    public rest : RestProvider,
    public navParams: NavParams) {
      super();
  }

  ionViewDidLoad() {
    this.pid = this.navParams.get('pid');
    this.uid = this.navParams.get('uid');
    this.comment = this.navParams.get('commentList');
  }
  ionViewDidEnter(){  //当进入页面时触发
    this.rest.hideTabs();
  }  
  ionViewWillLeave(){  //当将要从页面离开时触发
    this.rest.showTabs();
  }  
}
