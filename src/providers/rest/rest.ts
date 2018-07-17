import { Observable } from 'rxjs/Rx'
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  // ip = 'http://127.0.0.1';  //本地
  // ip = 'http://192.168.1.112';  //家里
  ip = 'http://www.laiwenge.com';  //服务器

  constructor(public http: Http) {
    // console.log('Hello RestProvider Provider');
  }

  
  //后端数据API
    //user
    private apiUrlRegister = this.ip + '/flower/api/user/register.php';
    private apiUrlLogin = this.ip + '/flower/api/user/login.php';
    private apiUrlLogout = this.ip + '/flower/api/user/logout.php';
    private apiUrlUserInfo = this.ip + '/flower/api/user/userinfo.php';
    private apiUrlUserLevel = this.ip + '/flower/api/user/customer_level.php';
    private apiUrlHeadface = this.ip + '/flower/api/user/headface.php';
    private apiUrlUpdateNickName = this.ip + '/flower/api/user/nickname.php';
    private apiUrlAddress = this.ip + '/flower/api/user/address.php'

    //product
    private apiUrlCarousel = this.ip + '/flower/api/product/carousel.php';
    private apiUrlRecommend = this.ip + '/flower/api/product/recommend.php';
    private apiUrlMainClassImg = this.ip + '/flower/api/product/productMainClassImg.php';
    private apiUrlProductList = this.ip + '/flower/api/product/productList.php';
    private apiUrlProductInfo = this.ip + '/flower/api/product/productInfo.php';
    private apiUrlProductImgList = this.ip + '/flower/api/product/productImgList.php';
    private apiUrlProductLike = this.ip + '/flower/api/product/productLike.php';
    private apiUrlAddToLike = this.ip + '/flower/api/product/addToLike.php';
    private apiUrlIsLikeAndCollectStatus = this.ip + '/flower/api/product/isLikeAndCollectStatus.php'
    
    //comment
    private apiUrlGetAllComment = this.ip + '/flower/api/comment/getAllComment.php';
    private apiUrlAddToComment = this.ip + '/flower/api/product/addToComment.php';

    //cart
    private apiUrlAddToCart = this.ip + '/flower/api/cart/addToCart.php'
    private apiUrlAddToCollect = this.ip + '/flower/api/cart/addToCollect.php'
    private apiUrlClearCart = this.ip + '/flower/api/cart/clearCart.php'
    private apiUrlUpdateCart = this.ip + '/flower/api/cart/updateCart.php'
    private apiUrlUpdateCartProductStatus = this.ip + '/flower/api/cart/updateCarProductStatus.php'
    private apiUrlGetCart = this.ip + '/flower/api/cart/getCart.php'
    private apiUrlIsCartAndCollectStatus = this.ip + '/flower/api/cart/isCartAndCollectStatus.php'
  //后端数据API-end

  /**
   * 根据用户的手机号码和密码进行登录
   * 
   * @param {any} mobile 
   * @param {any} password 
   * @param {any} latitude 
   * @param {any} longitude 
   * @returns {Observable < string[] >} 
   * @memberof RestProvider
   */
  login(mobile, password , latitude , longitude): Observable<string[]> {
    return this.getUrlReturn(this.apiUrlLogin + "?phone=" + mobile + "&upwd=" + password + "&latitude=" + latitude + "&longitude=" + longitude);
  }

  /**
   * 根据用户 手机号、昵称、密码 进行注册
   * 
   * @param {any} mobile 
   * @param {any} nickname 
   * @param {any} password 
   * @param {any} gender 
   * @returns {Observable <string[]>} 
   * @memberof RestProvider
   */
  register(mobile, nickname, password, gender): Observable<string[]> {
    return this.getUrlReturn(this.apiUrlRegister + "?phone=" + mobile + "&nickname=" + nickname + "&upwd=" + password +"&gender=" +gender);
  }

  headface(uid , imgs):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlHeadface + "?uid=" + uid + "&imgs=" + imgs);
  }

  address(uid, address, add, update): Observable<string[]> {
    return this.getUrlReturn(this.apiUrlAddress + "?userId=" + uid + "&address=" + address + "&add=" + add +"&update=" +update);
  }

  getUserInfo(userId): Observable<string[]> {
    return this.getUrlReturn(this.apiUrlUserInfo + "?userId=" + userId)
  }

  updateNickName(userId, nickname): Observable<string[]> {
    return this.getUrlReturn(this.apiUrlUpdateNickName + "?userId=" + userId + "&nickname=" + nickname);
  }

  carousel():Observable<string[]>{
    return this.getUrlReturn(this.apiUrlCarousel )
  }

  recommend(flowerName , page):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlRecommend + "?flowerName=" + flowerName +"&page=" + page )
  }

  mainClassImg():Observable<string[]>{
    return this.getUrlReturn(this.apiUrlMainClassImg)
  }

  productList(kw , pno , pageSize):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlProductList + "?kw=" + kw + "&pno=" + pno + "&pageSize=" + pageSize)
  }

  productInfo( pid ):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlProductInfo + "?pid=" + pid)
  }

  productLike( uid ):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlProductLike + "?userId=" + uid)
  }

  productImgList( pid ):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlProductImgList + "?pid=" + pid)
  }

  addToCart(uid , pid):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlAddToCart + "?userId=" + uid + "&productId=" + pid )
  }

  addToCollect(uid , pid):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlAddToCollect + "?userId=" + uid + "&productId=" + pid )
  }

  addToLike(uid , pid):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlAddToLike + "?userId=" + uid + "&productId=" + pid )
  }
  
  addToComment(uid , pid , comment):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlAddToComment + "?userId=" + uid + "&productId=" + pid + "&comment=" + comment)
  }
  
  clearCart(uid):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlClearCart + "?userId=" + uid )
  }
  
  updateCart(uid , pid , count , all):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlUpdateCart + "?userId=" + uid + "&productId=" + pid + "&count=" + count + "&all=" + all )
  }

  updateCartProductStatus(uid , pid , failStatus):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlUpdateCartProductStatus + "?userId=" + uid + "&productId=" + pid + "&failStatus=" +failStatus )
  }

  getCart(uid):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlGetCart + "?userId=" + uid )
  }

  isCartAndCollectStatus(uid , pid ):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlIsCartAndCollectStatus + "?userId=" + uid + "&productId=" + pid  )
  }

  isLikeAndCollectStatus(uid , pid ):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlIsLikeAndCollectStatus + "?userId=" + uid + "&productId=" + pid  )
  }
  
  getAllComment(uid , pid ):Observable<string[]>{
    return this.getUrlReturn(this.apiUrlGetAllComment + "?userId=" + uid + "&productId=" + pid  )
  }
  

  /**
   * 全局获取 http 请求的方法
   * 
   * @private
   * @param {string} url 
   * @returns {Observable<string[]>} 
   * @memberof RestProvider
   */
  private getUrlReturn(url: string): Observable<string[]> {
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError)
  }

  /**
   * 处理接口返回的数据  处理成json格式
   * 
   * @private
   * @param {Response} res 
   * @returns 
   * @memberof RestProvider
   */
  private extractData(res: Response) {
    let body = res.json()
    return JSON.parse(body) || {}
  }

  public hideTabs(){  //隐藏tabs选项卡
    let scrollContent = document.querySelectorAll('.scroll-content');
    Object.keys(scrollContent).map((key) => {
      scrollContent[ key ].style.marginBottom = '0px';
    });

    let fixedContent = document.querySelectorAll('.fixed-content');
    Object.keys(scrollContent).map((key) => {
      scrollContent[ key ].style.marginBottom = '0px';
    });

    let tabbarElem = document.querySelectorAll('.tabbar');
    Object.keys(tabbarElem).map((key) => {
      tabbarElem[ key ].style.display = 'none';
    });
  }

  public showTabs(){  //显示tabs选项卡
    let scrollContent = document.querySelectorAll('.scroll-content');
    Object.keys(scrollContent).map((key) => {
      scrollContent[ key ].style.marginBottom = '67px';
    });

    let fixedContent = document.querySelectorAll('.fixed-content');
    Object.keys(scrollContent).map((key) => {
      scrollContent[ key ].style.marginBottom = '67px';
    });

    let tabbarElem = document.querySelectorAll('.tabbar');
    Object.keys(tabbarElem).map((key) => {
      tabbarElem[ key ].style.display = 'flex';
    });
  }

  /**
   * 处理请求中的错误，考虑了各种情况的错误处理并处理在 console 中显示 error
   * 
   * @private
   * @param {(Response | any)} error 
   * @returns 
   * @memberof RestProvider
   */
  private handleError(error: Response | any) {
    let errMsg: string
    //instanceof 判断是否为Respones
    if (error instanceof Response) {
      const body = error.json() || ""
      const err = body.error || JSON.stringify(body)
      errMsg = `${error.status} - ${error.status || ""} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)
    return Observable.throw(errMsg)
  }
  
}
