import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, ToastController, ActionSheetController, Platform, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { RestProvider } from '../../providers/rest/rest';
import { BaseUi } from '../../common/baseui';
import { RegisterPage } from '../register/register';
import { ProductdetailPage } from '../productdetail/productdetail'

@IonicPage()
@Component({
  selector: 'page-collect',
  templateUrl: 'collect.html',
})
export class CollectPage extends BaseUi {
  errorMessage : any;
  uid : string;
  pid : string ;
  oneselfCart : any;
  buyCount = 1;
  pickAll = false;
  delBtnName = '删除';
  initPrice = 0;
  isLikeAndCollectStatus = {}

  constructor(
    public navCtrl: NavController,
    public loadCtrl : LoadingController,
    public toastCtrl : ToastController,
    public actionSheetCtrl : ActionSheetController,
    public storage : Storage,
    public rest : RestProvider,
    public alertCtrl: AlertController,
    public platform : Platform,
    public navParams: NavParams) {
      super();
  }

  ionViewDidLoad(){ //生命周期 => 页面加载前
    this.storage.get("userId").then((val) => {
      if(val != null) { //验证是否登陆,如果用户登录了,加载 商品信息
        var loading = this.showLoading(this.loadCtrl , "不要着急,加载中...");
        this.uid = val;
        this.loadOneselfCart(val);
        loading.dismiss()
      }else{  //如果没有登陆,跳转到 登陆 页
        this.navCtrl.push(RegisterPage,{
          status:'noLogin'
        });
      }
    })
  }

  ionViewDidEnter(){  //当进入页面时触发
    this.rest.hideTabs();
  }  
  ionViewWillLeave(){  //当将要从页面离开时触发
    this.rest.showTabs();
  }

  loadOneselfCart(uid){
    console.log(uid)
    this.rest.productLike(uid).subscribe( res=>{
      console.log(res);
      res.forEach((v,i)=>{
        v['pick'] = false;  //默认没有选择
        v['idx'] = i; //商品的下标
        v['ifItem'] = true; //每个item是否显示
      })
      this.oneselfCart = res;
    }, error => this.errorMessage = <any>error)
  }

  delItem(key){  //点击删除按钮
    this.oneselfCart.forEach((v,i)=>{
      if(v['idx'] == key){
        v['ifItem'] = false;
        this.rest.updateCart(this.uid,v['pid'],0,0).subscribe( res=>{
          console.log(res);
          if(res['msg']){
            super.showToast(this.toastCtrl,res['msg']);
          }
        }, error => this.errorMessage = <any>error)
      }
    })
  }

  addCart(){  //加入购物车
    this.rest.addToCart(this.uid,this.pid)
    .subscribe(res => {  //加入购物车
      console.log(res)
      this.isLikeAndCollectStatus['ishas_cart'] = true;
      super.showToast(this.toastCtrl, res["msg"]);
    },error => this.errorMessage = <any>error)
  }

  showProductInfo(pid){
    this.navCtrl.push(ProductdetailPage,{pid:pid,uid:this.uid})
  }

}
