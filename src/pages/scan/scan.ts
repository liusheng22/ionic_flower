import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { RestProvider } from '../../providers/rest/rest';


/**
 * Generated class for the ScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams , 
    public alertCtrl : AlertController ,
    public qrscnner : QRScanner,
    public rest : RestProvider) {
  }

  ionViewDidEnter(){  //当进入页面时触发
    this.scanQRScanner();
    this.rest.hideTabs();
  }  
  ionViewWillLeave(){  //当将要从页面离开时触发
    this.rest.showTabs();
  }  

  scanQRScanner(){
    this.qrscnner.prepare()

      .then((status:QRScannerStatus)=>{
        if(status.authorized){
          let scanSub = this.qrscnner.scan().subscribe((text:string)=>{
            let alert = this.alertCtrl.create({
              title : "二维码内容",
              subTitle : text ,
              buttons : ['OK']
            })
            alert.present() ;
            scanSub.unsubscribe();
          })

          this.qrscnner.show();
        }
        else if(status.denied){ //提醒用户没有开权限
          
        }
        else{

        }
      })
      .catch((e:any)=> console.error('Error : ' ,e))
  }

}
