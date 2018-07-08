import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map'

//聊天信息的属性
export class ChatMessage{
  messageId : string ;
  userId : string ;
  userName : string ;
  userImgUrl : string ;
  toUserId : string ;
  time : number | string ;
  message : string ;
  status : string ;
}

//用户信息的属性
export class UserInfo {
  userId : string ;
  userName : string ;
  userImgUrl : string ;
}

@Injectable()
export class ChatserviceProvider {

  constructor(public res : Http , public event : Events) {
    // console.log('Hello ChatserviceProvider Provider');
  }

  /**
   * 获取消息列表
   * 从 API 获取 或者从 json 中获取模拟数据
   * 
   * @returns {Promise<ChatMessage[]>} 
   * @memberof ChatserviceProvider
   */
  getMessageList(): Promise<ChatMessage[]>{
    const url = '../../assets/mock/msg-list.json'
    return this.res.get(url)
      .toPromise()
      .then(response => response.json().array as ChatMessage[])
      .catch(error => Promise.reject(error || '错误信息'))
  }

  /**
   * 模拟对方回复了一条消息
   * 问题 ：前台什么时候即时接受这一条消息?
   * 引入 Events 模块
   * 
   * @param {*} message 
   * @memberof ChatserviceProvider
   */
  newMessage(message : any){
    const id = Date.now().toString() ;
    let messageSend : ChatMessage = {
      messageId : id ,
      userId : '123321' ,
      userName :'女神' ,
      userImgUrl : 'http://img.mukewang.com/user/57a322f00001e4ae02560256-40-40.jpg' ,
      toUserId : message.userId ,
      time : Date.now() ,
      message : '你刚刚给我发送了 :『 ' + message.message + ' 』?' ,
      status : 'success'
    }

    setTimeout(() => {
      //在 event 中定义一个 chat.message ，一旦发生变化，便发布出去，并传递其值 messageSend
      this.event.publish('chat.received' , messageSend , Date.now())
    }, Math.random() * 1000);
  }

  sendMessage(message : ChatMessage){
    return new Promise(resolve =>{
      setTimeout(() => {
        resolve(message)
      }, Math.random()*1000);
    }).then(()=>{
      //模拟 回了一条消息
      this.newMessage(message) ;
    })
  }

}
