import { Component, forwardRef  } from '@angular/core';
import { ControlValueAccessor , NG_VALUE_ACCESSOR } from '@angular/forms';
import { EmojiProvider } from '../../providers/emoji/emoji'
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

//实现 EmojipickerComponent 的 providers
export const EMOJI_ACCESSOR : any = {
  provide : NG_VALUE_ACCESSOR,
  useExisting : forwardRef(()=> EmojipickerComponent ),
  multi : true
}
@Component({
  selector: 'emojipicker',
  templateUrl: 'emojipicker.html',
  providers : [EMOJI_ACCESSOR]
})
//实现接口 ControlValueAccessor
export class EmojipickerComponent implements ControlValueAccessor {
  @ViewChild(Slides) slides: Slides;

  emojiArray = [];
  content : string ;
  onChanged = Function ;
  onTouched = Function ;

  constructor(
    emojiProvider : EmojiProvider
  ) {
    this.emojiArray = emojiProvider.getEmojis();
  }

  writeValue(obj: any): void {
    this.content = obj;
  }
  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    this.setValue(this.content)
  }

  //再次处理新的内容赋值 以及函数的绑定
  setValue(val : any) : any {
    if(!this.content){
      this.content = val ;
      this.onChanged(this.content)
    }else{
      this.content += val ;
      this.onChanged(this.content)
    }
  }

}
