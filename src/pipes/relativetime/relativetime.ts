import { Pipe, PipeTransform } from '@angular/core';
//引用 JavaScript 中的包
import * as moment from 'moment' ;

/**
 * Generated class for the RelativetimePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'relativetime',
})
export class RelativetimePipe implements PipeTransform {
  /**
   * 将日期格式 转换成 对应的时间格式
   * @param value 
   * @param args 
   */
  transform(value: string, ...args) {
    moment.locale('zh-cn');
    return moment(value).toNow();
  }
}
