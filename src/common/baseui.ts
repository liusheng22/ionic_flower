import { Loading, LoadingController, ToastCmp, ToastController ,Toast , AlertController ,Alert} from 'ionic-angular'
import { LoadedModule } from 'ionic-angular/util/module-loader';


/**
 * UI 层的所有公共方法的抽象类
 * 
 * @export
 * @abstract
 * @class BaseUi
 */
export abstract class BaseUi {
    isShowTab : boolean;

    constructor() {
    }
    
    /**
     * 通用的展示 loading 组件
     * 
     * @protected
     * @param {LoadingController} loadingCtrl 展示等待框
     * @param {string} message 显示消息
     * @returns {Loading} 
     * @memberof BaseUi
     */
    protected showLoading(loadingCtrl : LoadingController,message : string) : Loading{
        let loader = loadingCtrl.create({
            content : message ,
            dismissOnPageChange : true  //页面变化的时候自动关闭loading
        });
        loader.present()
        return loader
    }

    /**
     * 通用的展示 toast 组件
     * 
     * @protected
     * @param {ToastController} toastCtrl  3秒提示框toast组件
     * @param {string} message 提示的消息
     * @returns {Toast} 
     * @memberof BaseUi
     */
    protected showToast(toastCtrl : ToastController , message : string) : Toast{
        let toast = toastCtrl.create({
            message : message ,
            duration : 3000 , 
            position : 'bottom' 
        })
        toast.present();
        return toast;
    }

    /**
     * 通用的 alert 组件
     * 
     * @param alertCtrl     alert提示框
     * @param til   弹出框的标题
     * @param content   弹出框的内容
     * @param btnName   确认按钮的名字
     */
    protected showAlert(alertCtrl : AlertController , til : string , content : string , btnName : string) : Alert{
        let alert = alertCtrl.create({
            title : til,
            subTitle : content ,
            buttons: [btnName] 
        })
        alert.present();
        return alert;
    }
}