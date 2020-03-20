import React from 'react';
import ReactDOM from 'react-dom';
import  { QrcodeScanner } from "./index.js";

let defaultOpt = {
    websocket: 'ws://10.0.0.14:2346',
    url: 'http://deploy-notify.utools.club/home/index/scan',
    queryStr: 'project_id=1',
    size: 256,
    bgColor: '#FFFF44',
    fgColor: '#CC00FF',
    imageSettings: {
        src: "https://cdn.learnku.com/uploads/images/201901/24/1/OyBnfB2vlk.png!/both/44x44",
        height: 30,
        width:30,
        excavate: true
    },
    scannedRenderText: "已扫描",
    scannedRender: true,
    scannedCallback:function(){
        let span = document.createElement('span');
        span.innerText = '测试';
        document.getElementById('1234').appendChild(span);
    }
};
ReactDOM.render(<QrcodeScanner url={defaultOpt.url} websocket={defaultOpt.websocket} 
    queryStr={defaultOpt.queryStr} size={defaultOpt.size} scannedRenderText={defaultOpt.scannedRenderText}
    bgColor={defaultOpt.bgColor} fgColor={defaultOpt.fgColor} imageSettings={defaultOpt.imageSettings}
    scannedCallback={defaultOpt.scannedCallback} scannedRender={defaultOpt.scannedRender} />, 
    document.getElementById("1234"));