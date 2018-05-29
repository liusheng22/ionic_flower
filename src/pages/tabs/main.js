// var pinyin = require("../../../node_modules/pinyin");
var os = require('os');  
var IPv4,hostName;  
hostName=os.hostname();  
// for(var i=0;i<os.networkInterfaces().eth0.length;i++){  
//     if(os.networkInterfaces().eth0[i].family=='IPv4'){  
//         IPv4=os.networkInterfaces().eth0[i].address;  
//     }  
// }  
console.log(os.networkInterfaces.etho);  
console.log('----------local IP: '+IPv4);  
console.log('----------local host: '+hostName);
 
// console.log(pinyin("刘胜"));
// console.log(pinyin("liusheng"));






























// console.log(pinyin("中心", {
//   heteronym: true               // 启用多音字模式 
// }));                            // [ [ 'zhōng', 'zhòng' ], [ 'xīn' ] ] 
// console.log(pinyin("中心", {
//   heteronym: true,              // 启用多音字模式 
//   segment: true                 // 启用分词，以解决多音字问题。 
// }));                            // [ [ 'zhōng' ], [ 'xīn' ] ] 
// console.log(pinyin("中心", {
//   style: pinyin.STYLE_INITIALS, // 设置拼音风格 
//   heteronym: true
// }));