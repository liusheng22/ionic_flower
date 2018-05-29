import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { MePage } from '../pages/me/me';
import { TabsPage } from '../pages/tabs/tabs';
import { SignUpPage } from '../pages/sign/sign-up'
import { SignInPage } from '../pages/sign/sign-in'
import { LoginPage } from '../pages/login/login'
import { RegisterPage } from '../pages/register/register';
import { UserPage } from '../pages/user/user'
import { HeadfacePage} from '../pages/headface/headface'
import { ProductdetailPage } from '../pages/productdetail/productdetail'
import { PayPage } from '../pages/pay/pay'
import { CartPage } from '../pages/cart/cart'
import { AddAddressPage } from '../pages/add-address/add-address'
import { ClassListPage } from '../pages/class-list/class-list'
import { ChatPage } from '../pages/chat/chat'
import { ChatdetailsPage } from '../pages/chatdetails/chatdetails'
import { ScanPage } from '../pages/scan/scan'
import { CommentPage } from '../pages/comment/comment'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from '../providers/rest/rest';
import { IonicStorageModule } from '@ionic/storage';  
//导入表情
import { EmojiProvider } from '../providers/emoji/emoji'
import { ComponentsModule } from '../components/components.module'

//导入外部加载进来的组件
import { File} from '@ionic-native/file'
import { Transfer , TransferObject} from '@ionic-native/transfer'
import { FilePath} from '@ionic-native/file-path'
import { Camera} from '@ionic-native/camera'
import { Geolocation } from '@ionic-native/geolocation'
import { ChatserviceProvider } from '../providers/chatservice/chatservice';
import { SettingProvider } from '../providers/setting/setting';
import { QRScanner } from '@ionic-native/qr-scanner'

//引入时间处理包
import { RelativetimePipe } from '../pipes/relativetime/relativetime'

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MePage,
    SignUpPage,
    SignInPage,
    LoginPage,
    RegisterPage,
    UserPage,
    ProductdetailPage,
    PayPage,
    AddAddressPage,
    CartPage,
    ClassListPage,
    ChatPage,
    ScanPage,
    ChatdetailsPage,
    CommentPage,
    HeadfacePage,
    RelativetimePipe
  ],
  imports: [  //全局模块
    BrowserModule,
    HttpModule, //全局需要导入 HTTP
    IonicModule.forRoot(MyApp , {
      backButtonText : '返回',
    }),
    ComponentsModule,
    IonicStorageModule.forRoot(),   //全局定义 storage 引入的方式不一样
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MePage,
    SignUpPage,
    SignInPage,
    LoginPage,
    RegisterPage,
    UserPage,
    CommentPage,
    ProductdetailPage,
    PayPage,
    AddAddressPage,
    ClassListPage,
    ChatPage,
    ChatdetailsPage,
    CartPage,
    ScanPage,
    HeadfacePage
    
  ],
  providers: [
    StatusBar,
    Geolocation,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,   //rest 的导入
    File,
    FilePath,
    Transfer,
    Camera,
    QRScanner,
    EmojiProvider,
    ChatserviceProvider,
    SettingProvider
  ]
})
export class AppModule {}
