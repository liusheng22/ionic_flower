import { Component ,ElementRef  } from '@angular/core';
import { Events ,NavController , NavParams , LoadingController, ToastController  } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/Storage'
import { RestProvider } from '../../providers/rest/rest';
import { BaseUi } from '../../common/baseui';
import { ProductdetailPage } from '../../pages/productdetail/productdetail'
import { ClassListPage } from '../../pages/class-list/class-list'
import { SearchPage } from '../../pages/search/search'
import { LoginPage } from '../login/login';
// import {Gesture} from 'ionic-angular/gestures/gesture';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Keyboard]
})

export class HomePage extends BaseUi{
  group_isShow = "" ;
  QRcode = "";
  QRshow : any;
  elem : any;
  errorMessage : any;
  flowerName : any;
  uid : string;
  temporaryVar : any ;
  ishas_add = [ //判断
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
    private event: Events, 
    private keyboard: Keyboard,
    public rest : RestProvider) {
      super();
  }

  ionViewDidEnter() {  //生命周期 => 页面加载完之后
    // console.log("页面加载完之后")
  }

  getRandomArrayElements(arr, count) {  //数组中随机取出若干数
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
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
          // if(val != null) { //验证是否登陆,如果用户登录了,加载 商品信息
            this.rest.addToCollect(val,pid)
                .subscribe(res => {  //返回 收藏 接口信息
                  console.log(res)
                  if(res["msg"]=="已加入收藏" || res["msg"]=="重新加入收藏" ){
                    this.temporaryVar = this.group_btn.splice(1,1)[0];
                    this.temporaryVar.color = "danger";
                    this.group_btn.splice( 1,0,( this.temporaryVar ) );
                  }else if(res["msg"]=="取消加入收藏"){
                    this.temporaryVar = this.group_btn.splice(1,1)[0];
                    this.temporaryVar.color = "primary";
                    this.group_btn.splice( 1,0,( this.temporaryVar ) );
                  }else{
                    super.showToast(this.toastCtrl, res["msg"]);
                  }
                  super.showToast(this.toastCtrl, res["msg"]);
                },error => this.errorMessage = <any>error)
          // }
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

  getRecommend(flowerName){ //分别加载 "鲜花" 和 "永生花" 的推荐商品
    this.rest.recommend(flowerName,1)
          .subscribe(product => {  //加载 商品分类信息
            console.log(product)
            if(flowerName == "鲜花"){
              let arr = this.getRandomArrayElements(product,8);
              this.goodsRecommend[0] = arr;
            }else{
              let arr = this.getRandomArrayElements(product,8);
              this.goodsRecommend[1] = arr;
            }
          },error => this.errorMessage = <any>error)
  }

  ionViewDidLoad(){ //生命周期 => 页面加载前
    this.keyboard.onKeyboardShow().subscribe(()=>this.event.publish('hideTabs'));
	  this.keyboard.onKeyboardHide().subscribe(()=>this.event.publish('showTabs'));

    this.storage.get("userId").then((val) => {
      if(val != null) { //验证是否登陆,如果用户登录了,加载 商品信息
        this.uid = val;
        var loading = super.showLoading(this.loadCtrl, "加载中...")
        this.rest.mainClassImg()
          .subscribe(res => {  //加载 商品信息
            console.log(res)
            res.forEach((v,idx)=>{
              
              this.recommendNumArr.push(Number(v['con']))

              this.mainContent[idx].main_til = v['main_til']
              this.mainContent[idx].main_til_i = v['main_til_i']

              this.goodsCategoryImg[idx].src = v['src']
              this.goodsCategoryImg[idx].href = v['href']
              this.goodsCategoryImg[idx].className = v['className']
              this.goodsCategoryImg[idx].alt = v['alt']
            })
          },error => this.errorMessage = <any>error)
        
        this.rest.carousel()
          .subscribe(res => {  //加载 轮播图
            console.log(res)
            this.banner = res
          },error => this.errorMessage = <any>error)
        
        this.getRecommend("永生花")
        this.getRecommend("鲜花")
        loading.dismiss()
      }else{  //如果没有登陆,跳转到 登陆 页
        this.navCtrl.push(LoginPage);
      }
    })
  }

  goToSearch(){
    this.navCtrl.push(SearchPage)
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

  goToClassList(className){  //进入花品不同类别
    this.navCtrl.push(ClassListPage,{cName:className,uid:this.uid})
  }

    // this.elem =  this.el.nativeElement.querySelector('.product_pic')
    // console.log(this.elem)

    // this.pressGesture = new Gesture(this.elem);
    // this.pressGesture.listen();
    // this.pressGesture.on('press', e => {
    //   console.log('pressed!!');
    // })
  // }

  

  // hideGroupBtn(getId){
    // this.group_isShow = ""
  // }

  setHeight(){
    // this.elem = this.el.nativeElement.querySelector('.product_pic')
    // console.log( this.el.nativeElement.querySelector('.product_pic') )
    // console.log( this.elem )
    // console.log( this.el.nativeElement )
    // console.log( document.querySelector('.product_pic') )
  }

  // ngOnInit(){ //页面初始化时
    // this.setHeight();
  // }

  // geCtrl.on("hold", function (e){
  //   console.log(1111)
  // }, angular.element(document.querySelector('.product_pic')))


}
