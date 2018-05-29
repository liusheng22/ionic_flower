import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, ToastController} from 'ionic-angular';
import { CommentPage } from '../comment/comment'
import { Storage } from '@ionic/storage'
import { RestProvider } from '../../providers/rest/rest';
import { BaseUi } from '../../common/baseui';
import { RegisterPage } from '../register/register';
import { PayPage } from '../pay/pay';
import { CartPage } from '../cart/cart';

// @IonicPage()
@Component({
  selector: 'page-productdetail',
  templateUrl: 'productdetail.html',
})
export class ProductdetailPage extends BaseUi {
  errorMessage : any;
  pid : string;
  uid : string;
  productInfo = {};
  productImgList = [];
  isLikeAndCollectStatus = {}
  content_html = '';
  heart_color : string;
  like_color : string;
  comment_color : string;
  tabbarElem : any;
  scrollContent : any;
  fixedContent : any;

  constructor(
    public navCtrl: NavController,
    public loadCtrl : LoadingController,
    public toastCtrl : ToastController,
    public storage : Storage,
    public rest : RestProvider,
    public navParams: NavParams) {
      super();
  }

  ionViewDidLoad(){ //生命周期 => 页面加载前
    this.pid = this.navParams.get('pid');
    this.uid = this.navParams.get('uid');

    this.storage.get("userId").then((val) => {
      if(val) { //验证是否登陆,如果用户登录了,加载 商品信息
        var loading = this.showLoading(this.loadCtrl , "不要着急,加载中...");
        this.uid = val;
        this.loadFlower(val,this.pid);
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

  loadFlower(uid,pid){  //加载商品信息
    this.rest.productInfo(pid).subscribe( res=>{
      console.log(res);
      this.content_html =  res[0]['content_html'] 
      res[0]['content_html'] = eval('decodeURI("'+res[0]['content_html']+'")');
      this.productInfo = res[0];
    }, error => this.errorMessage = <any>error)

    this.rest.productImgList(pid).subscribe( res=>{
      console.log(res);
      this.productImgList = res;
    }, error => this.errorMessage = <any>error)

    this.rest.isLikeAndCollectStatus(uid,pid).subscribe( res=>{
      console.log(res);
      this.isLikeAndCollectStatus = res;
      this.changeInitStatus(this.isLikeAndCollectStatus);
    }, error => this.errorMessage = <any>error)
  }

  changeInitStatus(res){
    if(res.ishas_like){
      this.like_color = 'danger';
    }else{
      this.like_color = 'primary';
    }
    if(res.ishas_collect){
      this.heart_color = 'danger';
    }else{
      this.heart_color = 'primary';
    }
    if(res.ishas_comment){
      this.comment_color = 'danger';
    }else{
      this.comment_color = 'primary';
    }
  }

  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
  }

  changeBtnStatus(status){ //判断点击的是 "点赞" "评论" "收藏"
    if(status == 'like'){
      this.rest.addToLike(this.uid,this.pid).subscribe( res=>{
        console.log(res);
        this.isLikeAndCollectStatus['like_count'] = res['count'];
        this.isLikeAndCollectStatus['ishas_like'] = !this.isLikeAndCollectStatus['ishas_like'];
        this.changeInitStatus(this.isLikeAndCollectStatus);
        super.showToast(this.toastCtrl,res['msg']);
      }, error => this.errorMessage = <any>error)
    }else if(status == 'comment') {
      this.rest.getAllComment(this.uid,this.pid).subscribe( res=>{
        console.log(res);
        res.forEach((item,idx)=>{
          console.log(item)
          item['last_time'] = this.timestampToTime(Number(item['last_time']));
        })
        this.navCtrl.push(CommentPage,{commentList:res,uid:this.uid,pid:this.pid});
      }, error => this.errorMessage = <any>error)
    }else{
      this.rest.addToCollect(this.uid,this.pid).subscribe( res=>{
        console.log(res);
        super.showToast(this.toastCtrl,res['msg']);
        this.isLikeAndCollectStatus['ishas_collect'] = !this.isLikeAndCollectStatus['ishas_collect'];
        this.changeInitStatus(this.isLikeAndCollectStatus);
      }, error => this.errorMessage = <any>error)
    }
  }

  goToCart(){
    this.navCtrl.push(CartPage,{uid:this.uid,pid:this.pid});
  }

  addToCart(){
    if(this.isLikeAndCollectStatus['ishas_cart']){  //购物车中已存在,不请求后台
      super.showToast(this.toastCtrl, "该商品购物车已存在,只等待您去付款啦~");
    }else{  //如果购物车没有,请求后台加入购物车
      this.rest.addToCart(this.uid,this.pid)
      .subscribe(res => {  //加入购物车
        console.log(res)
        this.isLikeAndCollectStatus['ishas_cart'] = true;
        super.showToast(this.toastCtrl, res["msg"]);
      },error => this.errorMessage = <any>error)
    }
  }

  goToBuy(){
    this.navCtrl.push(CommentPage,{uid:this.uid,pid:this.pid});
  }

  

}
