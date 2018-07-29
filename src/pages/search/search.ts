import { Component ,ElementRef , ViewChild  } from '@angular/core';
import { NavController , NavParams , IonicPage , LoadingController, ToastController , InfiniteScroll } from 'ionic-angular';
import { Storage } from '@ionic/Storage'
import { RestProvider } from '../../providers/rest/rest';
import { BaseUi } from '../../common/baseui';
import { RegisterPage } from '../register/register';
import { ProductdetailPage } from '../../pages/productdetail/productdetail'
import { LoadmoreProvider } from '../../providers/loadmore/loadmore'

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage extends BaseUi {
  @ViewChild('searchInput') searchInput;
  keyword : any ;
  cName : any;
  uid : any;
  errorMessage : any;
  classList = [];
  QRcode = "";
  QRshow : any;
  group_isShow = "" ;
  temporaryVar : any ;  //临时全局变量
  loadPage : number ; //加载的页数
  infinite : any ; //上拉加载更多的event事件
  ishas_add = [
    {
      name : "",
      status : false,
    },
    {
      name : "",
      status : false,
    }
  ]
  
  banner = [  //banner轮播图
  ];

  goodsCategoryImg = [  //商品分类主图
    {
      src:"",
      href:"",
      className:"",
      alt:""
    },{
      src:"",
      href:"",
      className:"",
      alt:""
    }
  ];

  recommendNumArr = [] //需要展示的推荐个数的数组

  mainContent = [ //推荐商品分类的标题
    {
      main_til:"",
      main_til_i:"",
    },
    {
      main_til:"",
      main_til_i:"",
    }
  ];

  goodsRecommend = [ //商品推荐
  ];

  group_btn = [ //商品工具按钮
    {
      className:"cart group_btn_list",
      group_til:"加入购物车",
      tap_href:"#",
      tap:"cart",
      status : false,
      color:"primary"
    },
    {
      className:"collect group_btn_list",
      group_til:"加入收藏",
      tap_href:"#",
      tap:"heart",
      status : false,
      color:"primary"
    },
    {
      className:"barcode group_btn_list",
      group_til:"二维码",
      tap_href:"#",
      tap:"qr-scanner",
      status : false,
      color:"primary"
    },
    {
      className:"share group_btn_list",
      group_til:"分享",
      tap_href:"#",
      tap:"share-alt",
      status : false,
      color:"primary"
    }
  ]

  colorName = [{
    color : "colorName"
  },{
    color:""
  }]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams  ,
    public el : ElementRef ,
    public loadCtrl : LoadingController,
    public toastCtrl : ToastController,
    public storage : Storage,
    public rest : RestProvider,
    public loadmore : LoadmoreProvider ,
  ) {
    super();
  }
  
  ionViewDidLoad(){ //生命周期 => 页面加载前
    this.rest.hideTabs();
    this.cName = this.navParams.get('cName');
    this.uid = this.navParams.get('uid');

    this.storage.get("userId").then(val => {
      if(val) { //验证是否登陆,如果用户登录了,加载 商品信息
        var loading = this.showLoading(this.loadCtrl , "不要着急,加载中...");
        this.uid = val;
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
    setTimeout(() => {
      this.rest.hideTabs();
      this.searchInput.setFocus();
    },150)
  }

  ionViewWillLeave(){  //当将要从页面离开时触发
    this.rest.showTabs();
  }

  doRefresh(refresher){ //下拉刷新
    this.loadClassInfo(this.keyword);
    refresher.complete();
  }

  doInfinite(infinite : InfiniteScroll){  //上拉加载更多
    this.loadPage++ ;
    this.infinite = infinite ;
    console.log()

    this.rest.productList(this.keyword,this.loadPage,10)
      .subscribe(product => {
        if(product['status'] == false){
          super.showToast(this.toastCtrl, product['msg']);
          this.infinite.enable(false);
        }else{
          this.classList = this.classList.concat( product['data'] );
          console.log(this.classList)
        }

        infinite.complete();
      },error => this.errorMessage = <any>error)
  }

  searchProduct(kd : any ){
    this.loadClassInfo(kd);
    if(this.infinite){
      this.infinite.enable(true);
    }
  }

  loadClassInfo(keyword : any){  //首次加载搜索的关键字相关商品
    this.rest.hideTabs();

    this.rest.productList(keyword,1,10)
      .subscribe(product => {
        if(product['status'] == false){
          super.showToast(this.toastCtrl, product['msg']);
        }else{
          this.classList = product['data'];
          this.loadPage = 1 ;
        }
      },error => this.errorMessage = <any>error)
  }

  groupBtnFun(btnFunName,pid,QRcode){ //点击组按钮中任一按钮时
    //pop push shift unshift splice sort reverse  数组操作 更新视图
    if(btnFunName == "加入购物车"){
      if(this.ishas_add[0].status){ //判断如果"购物车"已被点亮,不请求后台,给出提示
        super.showToast(this.toastCtrl, "该商品购物车已存在,只等待您去付款啦~");
      }else{  //如果购物车没被点亮,请求后台加入购物车
        this.storage.get("userId").then((val) => {
          this.rest.addToCart(val,pid)
          .subscribe(res => {  //加入购物车
            console.log(res)
            super.showToast(this.toastCtrl, res["msg"]);
          },error => this.errorMessage = <any>error)
        })
      }
    }else if(btnFunName == "加入收藏"){
        this.storage.get("userId").then((val) => {
          if(val != null) { //验证是否登陆,如果用户登录了,加载 商品信息
            this.rest.addToCollect(val,pid)
                .subscribe(res => {  //返回 收藏 接口信息
                  console.log(res)
                  if(res["msg"]=="谢谢您的青睐" || res["msg"]=="果然你还是喜欢我的" ){
                    this.temporaryVar = this.group_btn.splice(1,1)[0];
                    this.temporaryVar.color = "danger";
                    this.group_btn.splice( 1,0,( this.temporaryVar ) );
                  }else if(res["msg"]=="你真的不喜欢我了么"){
                    this.temporaryVar = this.group_btn.splice(1,1)[0];
                    this.temporaryVar.color = "primary";
                    this.group_btn.splice( 1,0,( this.temporaryVar ) );
                  }else{
                    super.showToast(this.toastCtrl, res["msg"]);
                  }
                  super.showToast(this.toastCtrl, res["msg"]);
                },error => this.errorMessage = <any>error)
          }
        })
    }else if(btnFunName == "二维码"){
      if(this.QRshow){
        this.QRcode = QRcode; //显示二维码
        this.QRshow = false;
      }else{
        this.QRcode = ''; //隐藏二维码
        this.QRshow = true;
      }
    }else if(btnFunName == "分享"){
      super.showToast(this.toastCtrl, "sorry,暂时不支持分享功能");
    }
  }

  async showGroupBtn(pid){  //长按商品图片 获得其ID 显示工具按钮
    // this.elem = this.el.nativeElement.querySelector('.product_pic') //获取DOM元素
    this.QRshow = true;
    this.storage.get("userId").then((val) => {
      this.rest.isCartAndCollectStatus(val,pid)
      .subscribe(res => {  //返回 该商品是否已经加入 "购物车" 或 "收藏"
        console.log(res)

        res['ishas_cart'] ? this.group_btn[0].color = "danger" : this.group_btn[0].color = "primary";
        res['ishas_collect'] ? this.group_btn[1].color = "danger" : this.group_btn[1].color = "primary";
      },error => this.errorMessage = <any>error)
    })
    this.group_isShow = pid
  }

  async showproductDetail(pid){  //商品详情
    this.navCtrl.push(ProductdetailPage,{pid:pid,uid:this.uid})
  }

}
