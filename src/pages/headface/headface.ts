import { Component } from '@angular/core';
import { IonicPage, normalizeURL, NavController, NavParams, ActionSheetController, ModalController, LoadingController, Platform, ToastController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { BaseUi } from '../../common/baseui';
import { RestProvider } from '../../providers/rest/rest';

//导入四个外部组件
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any //导入第三方的库定义到 TS 项目中

/**
 * Generated class for the HeadfacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-headface',
  templateUrl: 'headface.html',
})
export class HeadfacePage extends BaseUi {

  userId: string
  errorMessage: string
  lastImage: string = null

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public rest: RestProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public camera: Camera,
    public toastCtrl: ToastController,
    public transfer: Transfer,
    public file: File,
    public viewCtrl: ViewController,
    public filePath: FilePath,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController) {
    super()
  }

  ionViewDidEnter() {  //页面加载完之后
    this.storage.get("UserId").then((val) => {
      if (val != null) {
        this.userId = val
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HeadfacePage');
  }

  presentActionSheet() { //选择要上传的照片
    let actionSheet = this.actionSheetCtrl.create({
      title: "选择图片",
      buttons: [
        {
          text: "从图库中选择",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY)
          }
        },
        {
          text: "使用相机",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA)
          }
        },
        {
          text: "取消",
          role: "cancel",
        },
      ]
    })
    actionSheet.present()
  }

  takePicture(sourceType) {
    //定义相机的一些参数
    var options = {
      quality: 100, //图片质量
      sourceType: sourceType, //资源类型
      saveToPhotoAlbum: false, //是否保存拍照的照片到相册中去
      correctOrientation: true, //是否纠正拍照照片的方向
    }

    //获取图片的方法
    this.camera.getPicture(options).then(imagePath => {
      //特别处理安卓 平台的文件路径问题
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) { //如果当前是安卓环境下的 相册
        this.filePath.resolveNativePath(imagePath)  //获取安卓下的真实路径
          .then(filePath => {
            //获取正确的路径
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1)
            //获取正确的文件名
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'))
            this.copyFileToLocalDir(correctPath, currentName, this.creatFileName())
          })
      } else {  //其他平台
        //获取正确的路径
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1)
        //获取正确的文件名
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1)
        this.copyFileToLocalDir(correctPath, currentName, this.creatFileName())
      }
    }, (err) => { super.showToast(this.toastCtrl, "选择图片出现错误,请在App中操作或检查相关权限") })
  }

  //将获取到的图片 或 相机拍摄的照片进行另存为，用于后期的图片上传使用
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName
    }, error => { this.showToast(this.toastCtrl, "存储图片到本地图库出现错误") })
  }

  //为文件生成新的文件名
  creatFileName() {
    var d = new Date(), n = d.getTime(), newFileName = n + ".jpg"
    return newFileName
  }

  //处理图片路径为可以上传的路径
  public pathForImage(img) {
    if (img === null) {
      return ''
    } else {
      return normalizeURL(cordova.file.dataDirectory + img)
    }
  }

  uploadImage() {
    var url = 'https://imoocqa.gugujiankong.com/api/account/uploadheadface'
    var targetPath = this.pathForImage(this.lastImage)
    var filename = this.userId + '.jpg'   //定义上传后的文件名
    var options = {   //上传的参数
      filekey: 'file',
      fileName: filename,
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'fileName': filename, 'userId': this.userId }
    }

    const fileTransfer: TransferObject = this.transfer.create()

    var loading = super.showLoading(this.loadingCtrl, "上传中...")

    //开始正式上传
    fileTransfer.upload(targetPath, url, options).then(data => {
      loading.dismiss()
      super.showToast(this.toastCtrl, "图片上传成功")
      //在用户看完弹框提示信息之后 再进行页面关闭
      setTimeout(() => {
        this.viewCtrl.dismiss()
      }, 2500);
    }, err => {
      loading.dismiss()
      super.showToast(this.toastCtrl, "图片上传发生错误,请重试")
    })
  }

}
