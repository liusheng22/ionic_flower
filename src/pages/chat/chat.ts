import { Component ,ViewChild ,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatdetailsPage } from '../chatdetails/chatdetails';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var BMap;
declare var BMap_Symbol_SHAPE_POINT;
declare var BMAP_STATUS_SUCCESS;

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild('maps') map_container : ElementRef;
  map: any;//地图对象
  marker: any;//标记
  geolocation1: any;
  myIcon: any;
  
  userinfo: Object;
  ChatdetailsPage: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private geolocation: Geolocation) {
    //你在这里也可以直接从你的 API 接口或者其他的方法实现用户列表的定义
    this.userinfo = {
      userid: '123321',
      username: '慕女神'
    }
    this.ChatdetailsPage = ChatdetailsPage;

    // map 部分
    this.myIcon = new BMap.Icon("assets/icon/map.png", new BMap.Size(30, 30));
  }

  ionViewDidEnter() {
    // this.getLocationByBrowser()
    // this.getLocationByIp()
    // this.getLocationByCity()
    // this.getLocationByLatLon()
    this.getLocation()


    let map =
      this.map =
      new BMap.Map(
        this.map_container.nativeElement,
        {
          enableMapClick: true,//点击拖拽
          enableScrollWheelZoom: true,//启动滚轮放大缩小，默认禁用
          enableContinuousZoom: true //连续缩放效果，默认禁用
        }
      );//创建地图实例
    // map.centerAndZoom("广州",17); //设置城市设置中心和地图显示级别
    // map.addControl(new BMap.MapTypeControl());//地图类型切换
    // map.setCurrentCity("广州"); //设置当前城市

    // 114.044987,22.626686   //最准确的位置
    let point = new BMap.Point(114.044987,22.626686);//坐标可以通过百度地图坐标拾取器获取
    let marker = new BMap.Marker(point);
    this.map.addOverlay(marker);
    map.centerAndZoom(point, 18);//设置中心和地图显示级别
    let sizeMap = new BMap.Size(10, 80);//显示位置
    map.enableScrollWheelZoom(true);//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom(true);//连续缩放效果，默认禁用
    // map.addControl(new BMap.NavigationControl());
    // let myIcon = new BMap.Icon("assets/icon/favicon.ico", new BMap.Size(300, 157));
    // let marker = this.marker = new BMap.Marker(point, { icon: myIcon });
    // map.addOverlay(marker);
  }

  getLocationByBrowser() {
    let geolocation1 = this.geolocation1 = new BMap.Geolocation();
    geolocation1.getCurrentPosition((r) => {
      console.log(r)
      let mk = this.marker = new BMap.Marker(r.point, { icon: this.myIcon });
      if (geolocation1.getStatus() == BMAP_STATUS_SUCCESS) {
        this.map.addOverlay(mk);
        this.map.panTo(r.point, 16);
        console.log('浏览器定位：您的位置是 ' + r.point.lng + ',' + r.point.lat);
      }
      else {
        alert('failed' + this.geolocation1.getStatus());
      }
    }, { enableHighAccuracy: false })
  }

  getLocationByIp() {
    let myCity = new BMap.LocalCity();
    myCity.get(result => {
      console.log(result)
      let cityName = result.name;
      this.map.setCenter(cityName);
      console.log("当前定位城市:" + cityName);
    });
  }

  getLocationByCity() {
    let city = "广州";
    if (city != "") {
      console.log(this.map)
      this.map.centerAndZoom(city, 16);      // 用城市名设置地图中心点
    }
  }
  getLocationByLatLon() {
    let point = new BMap.Point(114.044987,22.626686);
    let marker = this.marker = new BMap.Marker(point, { icon: this.myIcon });
    this.map.addOverlay(marker);
    this.map.centerAndZoom(point, 16);
  }
  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let locationPoint = new BMap.Point(resp.coords.longitude, resp.coords.latitude);
      let convertor = new BMap.Convertor();
      let pointArr = [];
      pointArr.push(locationPoint);
      console.log(pointArr)
      convertor.translate(pointArr, 1, 5, (data) => {
        if (data.status === 0) {
          let marker = this.marker = new BMap.Marker(data.points[0], { icon: this.myIcon });
          this.map.panTo(data.points[0]);
          marker.setPosition(data.points[0]);
          this.map.addOverlay(marker);
        }
      })
      console.log('GPS定位：您的位置是 ' + resp.coords.longitude + ',' + resp.coords.latitude);
      alert('GPS定位：您的位置是 ' + resp.coords.longitude + ',' + resp.coords.latitude);
    })
  }

}
