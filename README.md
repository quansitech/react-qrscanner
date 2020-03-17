## summary

## install
npm i @quansitech/react-qrscanner

## usage
```js
import React from 'react';
import ReactDOM from 'react-dom';
import  { QrcodeScanner } from "@quansitech/react-qrscanner";

let defaultOpt = {
    host: '192.168.31.222', //websocket host 必填
    port: 2346, //websocket 端口 必填
    url: 'http://deploy-notify.utools.club/home/index/scan',  //二维码的地址，会自动在后面附上token 必填
    queryStr: 'project_id=1', //根据业务需要可在这里附加必须的参数 选填
    size: 128, //二维码的大小 选填 默认128
    bgColor: '#FFFF44', //二维码背景颜色 选填
    fgColor: '#CC00FF', //二维码前景色 选填
    imageSettings: {  //设置二维码中间图片 选填
        src: "https://cdn.learnku.com/uploads/images/201901/24/1/OyBnfB2vlk.png!/both/44x44", //图片的url地址
        height: 30, //图片高度
        width:30, //图片宽度
        excavate: true //是否挖孔
    },
    scannedRenderText: "已扫描", //扫描后展示的文字 选填 默认“已绑定”
    scannedRender: true, //是否使用扫描后自带的提示 选填 默认true
    scannedCallback:function(){ //扫描后执行的回调 选填
        let span = document.createElement('span');
        span.innerText = '测试';
        document.getElementById('1234').appendChild(span);
    }
};
ReactDOM.render(<QrcodeScanner url={defaultOpt.url} port={defaultOpt.port} host={defaultOpt.host} 
    queryStr={defaultOpt.queryStr} size={defaultOpt.size} scannedRenderText={defaultOpt.scannedRenderText}
    bgColor={defaultOpt.bgColor} fgColor={defaultOpt.fgColor} imageSettings={defaultOpt.imageSettings}
    scannedCallback={defaultOpt.scannedCallback} scannedRender={defaultOpt.scannedRender} />, 
    document.getElementById("1234"));
```

