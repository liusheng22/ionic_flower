import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, ModalController, LoadingController , ToastController, ViewController , Content, TextInput, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { BaseUi } from '../../common/baseui';
import { ChatserviceProvider, ChatMessage } from '../../providers/chatservice/chatservice'
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-chatdetails',
  templateUrl: 'chatdetails.html',
})
export class ChatdetailsPage extends BaseUi {
  
  uid : string; //我的 uid
  uname : string ;  //我的 name
  userImgUrl : string ; //头像
  chatUserName : string;  //聊天对方的 name
  chatUserUid : string; //聊天对方的 uid
  isOpenEmojiPicker = false;  //是否打开表情选择器
  messageList : ChatMessage[] = []; //消息数组
  errorMessage : string; 
  editorMessage : string ;  //双向绑定的 文本框中的消息内容
  @ViewChild(Content) content : Content;  //获取全局 content  就是页面
  @ViewChild('chatInput') messageInput : TextInput ;
  

  constructor(
    public navparams: NavParams,
    public modalCtrl: ModalController,
    public loadCtrl: LoadingController,
    public rest: RestProvider,
    public viewCtrl : ViewController,
    public toastCtrl: ToastController,
    public storage : Storage,
    public chatServiceProvider : ChatserviceProvider ,
    public event : Events  ) {
      super();
      this.chatUserName = this.navparams.get('username');
      this.chatUserUid = this.navparams.get('userid');
  }

  ionViewDidLoad() {
    this.rest.hideTabs();
  }

  ionViewDidEnter(){  //页面渲染前，开始调用消息
    this.rest.hideTabs();

    this.storage.get("userId").then((val) => {
      if(val) { //验证是否登陆,如果用户登录了,加载 用户信息
        this.rest.getUserInfo(val)
          .subscribe(res=>{
            this.uid = res['userId'];
            this.uname = res['nickname'];
            this.userImgUrl = "http://www.laiwenge.com/flower/imgs/avatar/" + res["avatar"];
          },
        error => this.errorMessage = <any>error)
      }
    })

    this.getMessages().then(()=>{ //调用完聊天信息后，将滚动条滚动到最底端
        this.scrollToBottom();
      })

    //听取消息的发布 订阅
    this.event.subscribe('chat.received' , (msg , time)=>{
      this.messageList.push(msg) ;
      //听取完消息会后 应该让滚动条滚动到最下面
      this.scrollToBottom();
    })
  }

  ionViewWillLeave(){
    this.rest.showTabs();

    this.event.unsubscribe('chat.received') ;
  }

  focus(){
    this.isOpenEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * 调用 service 里面的方法进行属性的赋值
   * 
   * @returns 
   * @memberof ChatdetailsPage
   */
  getMessages(){
    return this.chatServiceProvider.getMessageList()
      .then(res => {
        this.messageList = res;
      })
      .catch(error => {
        console.error(error)
      })
  }

  getMessageIndex(id : string){  //通过 id 获得index
    //判断其中 messageId 和 传来的 id 一致性是否存在
    return this.messageList.findIndex(e=>e.messageId === id)  //用法: e 循环 messageList 中每一项 messageId 与 id做对比，取第一个index
  }

  sendMessage(){
    if(!this.editorMessage.trim()){ //如果消息为空，则不发送(去掉空格进行判断)
      return ;
    }

    const id = Date.now().toString();
    let messageSend : ChatMessage = {
      messageId : id ,
      userId : this.uid ,
      userName :this.uname ,
      userImgUrl : this.userImgUrl ,
      toUserId : this.chatUserUid ,
      time : Date.now() ,
      message : this.editorMessage ,
      status : 'pending'
    }

    this.messageList.push(messageSend); //消息对象 入栈 数组
    this.scrollToBottom();
    
    this.editorMessage = '';  //发送完消息，输入框为空

    if(!this.isOpenEmojiPicker){  //聊天窗口是否打开
      this.messageInput.setFocus(); //是 => 消息聊天输入框获得焦点
    }

    //发送消息并改变消息的状态
    this.chatServiceProvider.sendMessage(messageSend)
      .then(()=>{
        let index = this.getMessageIndex(id) ;
        if(index !== -1){
          this.messageList[index].status = 'success' ;
        }
      })
  }

  switchEmojiPicker(){  //切换表情组件
    this.isOpenEmojiPicker = !this.isOpenEmojiPicker;
  }

  scrollToBottom(): any { //滚动到底部
    setTimeout(()=>{
      if(this.content.scrollToBottom){
        this.content.scrollToBottom();
      }
    },400)
  }

}
