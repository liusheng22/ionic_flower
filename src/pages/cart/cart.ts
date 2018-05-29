import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, ToastController, ActionSheetController, Platform, AlertController} from 'ionic-angular';
import { CommentPage } from '../comment/comment'
import { Storage } from '@ionic/storage'
import { RestProvider } from '../../providers/rest/rest';
import { BaseUi } from '../../common/baseui';
import { RegisterPage } from '../register/register';
import { PayPage } from '../pay/pay';
import { HomePage } from '../home/home'
import { ProductdetailPage } from '../productdetail/productdetail'

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage extends BaseUi {
  errorMessage : any;
  uid : string;
  oneselfCart : any;
  buyCount = 1;
  pickAll = false;
  delBtnName = '删除';
  initPrice = 0;

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

  // ionViewWillEnter(){ //生命周期 => 当页面即将进入并成为活动页面时运行。
  // }

  // ionViewDidEnter(){  //当进入页面时触发
  //   this.rest.hideTabs();
  // }  
  // ionViewWillLeave(){  //当将要从页面离开时触发
  //   this.rest.showTabs();
  // }

  loadOneselfCart(uid){
    console.log(uid)
    this.rest.getCart(uid).subscribe( res=>{
      console.log(res);
      res.forEach((v,i)=>{
        v['pick'] = false;  //默认没有选择
        v['idx'] = i; //商品的下标
        v['ifItem'] = true; //每个item是否显示
      })
      this.oneselfCart = res;
    }, error => this.errorMessage = <any>error)
  }

  logDrag(eve){
    console.log(eve)
  }

  delete(){
    console.log('删除某个项目')
  }

  clearing(){ //结算价格
    this.initPrice = 0;
    this.oneselfCart.forEach((v,i)=>{
      if(v['pick']){
        this.initPrice += Number((v['price_min']*v['p_count'])/100);
      }
    })
  }

  delItem(key){  //点击删除按钮
    if(key>=0){  //如果指定了要删除的商品编号
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
    }else{  //如果没有指定要删除的商品编号
      if(!this.pickAll){  //如果删除某些
        this.oneselfCart.forEach((v,i)=>{
          if(v['pick']){
            v['ifItem'] = false;
            this.rest.updateCart(this.uid,v['pid'],0,0).subscribe( res=>{
              console.log(res);
              if(res['msg']){
                super.showToast(this.toastCtrl,res['msg']);
              }
            }, error => this.errorMessage = <any>error)
          }
        })
      }else{  //如果删除所有的
        this.oneselfCart = [];
        this.rest.updateCart(this.uid,0,0,1).subscribe( res=>{
          console.log(res);
          if(res['msg']){
            super.showToast(this.toastCtrl,res['msg']);
          }
        }, error => this.errorMessage = <any>error)
        document.getElementById('pickAll')['checked'] = false; //取消全选
        this.pickAll = false;
      }
    }
    // this.loadOneselfCart(this.uid);
    // location.reload(true)

    this.clearing()
  }

  isPickAll(idx){
    if(this.oneselfCart.length==0){
      this.pickAll = false; //取消全选
      document.getElementById('pickAll')['checked'] = false;
      super.showAlert(this.alertCtrl,'提示','还没有商品可以选,先去挑点喜欢的吧','朕知道了');
    }
    if(Number(idx)>=0){
      if(typeof(idx) == 'number'){  //单选商品时
        this.oneselfCart[idx]['pick'] = !this.oneselfCart[idx]['pick'];
        let imgNum = 0;
        let sum = 0;
        this.oneselfCart.forEach((v,i)=>{
          sum++;
          if(v['pick']){
            imgNum++;
          }
        })
        if(sum == imgNum){
          this.pickAll = true;  //全选
          document.getElementById('pickAll')['checked'] = true;
          this.delBtnName =  "全删除";
        }else{
          this.pickAll = false; //取消全选
          document.getElementById('pickAll')['checked'] = false;
          this.delBtnName =  "删除";
        }
      }
    }else{
      if(document.getElementById('pickAll')['checked']){
        this.pickAll = true;  //全选
        this.delBtnName = "全删除";
        this.oneselfCart.forEach((v,i)=>{
          v['pick'] = true;
        })
      }else{
        this.pickAll = false; //取消全选
        this.delBtnName =  "删除";
        this.oneselfCart.forEach((v,i)=>{
          v['pick'] = false;
        })
      }
    }

    this.clearing()
  }
  isPick(idx){  //单选商品图片时,勾选
    if(idx>=0){
      this.oneselfCart[idx]['pick'] = true;
      let imgNum = 0;
      let sum = 0;
      this.oneselfCart.forEach((v,i)=>{
        sum++;
        if(v['pick']){
          imgNum++;
        }
      })
      if(sum == imgNum){
        this.pickAll = true;
        document.getElementById('pickAll')['checked'] = true;
        this.delBtnName = "全删除";
      }else{
        this.pickAll = false;
        document.getElementById('pickAll')['checked'] = false;
        this.delBtnName =  "删除";
      }
    }

    this.clearing()
  }

  addOrMinus(pid,isNo){ //添加 或 减少 商品数量
    this.oneselfCart.forEach((val,idx)=>{
      if(val.pid == pid){
        if(isNo){ // 加商品的时候
          if(val.p_count >= 5){
            super.showToast(this.toastCtrl,"最多添加5个,不可以添加更多了哟~")
          }else{
            val.p_count = Number(val.p_count) + 1;
            this.rest.updateCart(this.uid,pid,val.p_count,0).subscribe( res=>{
              console.log(res);
              if(res['msg']){
                super.showToast(this.toastCtrl,res['msg']);
              }
            }, error => this.errorMessage = <any>error)
          }
        }else{  // 减商品的时候
          if(val.p_count == 1){ //如果商品个数为 1 ，则将被删除
            let actionSheet = this.actionSheetCtrl.create({ //弹出confirm选择框
              title: '您确定要删除该商品吗?',
              buttons: [
                {
                  text: '删除该商品',
                  icon: 'trash' ,
                  role: 'destructive',
                  handler: () => {
                    this.rest.updateCart(this.uid,pid,0,0).subscribe( res=>{
                      console.log(res);
                      if(res['msg']){
                        super.showToast(this.toastCtrl,res['msg']);
                      }
                    }, error => this.errorMessage = <any>error)
                    this.oneselfCart.forEach((v,i)=>{
                      if(v['pid'] == pid){
                        console.log(v['pid'],v['ifItem'])
                        v['ifItem'] = false;
                      }
                    })
                  }
                },{
                  text: '点错了不想删',
                  role: 'cancel',
                  icon: 'close',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                }
              ]
            });
            actionSheet.present();
          }else if(val.p_count > 1){  //否则，则正常减少个数
            val.p_count = Number(val.p_count) - 1;
            this.rest.updateCart(this.uid,pid,val.p_count,0).subscribe( res=>{
              console.log(res);
              if(res['msg']){
                super.showToast(this.toastCtrl,res['msg']);
              }
            }, error => this.errorMessage = <any>error)
          }
        }
      }
    })

    this.clearing()
  }

  showProductInfo(pid){
    this.navCtrl.push(ProductdetailPage,{pid:pid,uid:this.uid})
  }

  customNum(pid){ //自定义添加商品数量
    console.log(pid);
  }

  goToPay(){
    let pidList = [];
    this.oneselfCart.forEach((v,i)=>{
      if(v['pick']){
        pidList.push(v['pid']);
      }
    })
    if(pidList.length){ //选中的物品去结算
      this.navCtrl.push(PayPage,{uid:this.uid,pid:pidList});
    }else{  //没有选中物品
      if(this.oneselfCart.length){  //购物车有商品,只是用户还没有选中
        super.showToast(this.toastCtrl,'选好喜欢的再来结算吧~');
      }else{  //购物车没有商品
        super.showAlert(this.alertCtrl,'提示','购物车空空如也，先去挑选东西吧~','朕这就去');
        this.navCtrl.push(HomePage,{uid:this.uid});
      }
    }
  }

}
