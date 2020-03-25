import React from 'react';
import Qrcode from './Qrcode';
import { v4 as uuidv4 } from 'uuid';
import loading from "./loading.svg";

class QrcodeScanner extends React.Component{

    constructor(props){
        super(props);

        this.qrcode = React.createRef();

        this.state = { token: uuidv4(), connecting:true };

        this.socket = null;

        this.connect();


    }

    componentWillUnmount = () => {
        this.socket.close();
    }

    refresh = () => {
    
        this.setState({ token: uuidv4() }, () => {
            this.qrcode.current.valid();
            this.bindToken();
        });
        
    }

    bindToken = () => {
        let data = {
            type: 'BindToken',
            data: {
                token: this.state.token
            }
        }
        this.socket.send(JSON.stringify(data));
    }

    handleScan = (data) => {
        if(data.status == 1){
            this.qrcode.current.scan();



            if(typeof this.props.scannedCallback == 'function'){
                this.props.scannedCallback();
            }
        }
        else{
            this.qrcode.current.invalid();
        }
        
    }

    handleTokenInvalid = () => {
        this.qrcode.current.invalid();
    }

    connect = () => {
        let url = this.props.websocket;
        this.socket = new WebSocket(url);
        const that = this;
        this.socket.addEventListener('open', function (event) {
            that.setState({ connecting: false });
            that.bindToken();

            that.intervalId = setInterval(that.checkToken, 1000);
        });

        this.socket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data);
            switch(data['type']){
                case 'Scan':
                    that.handleScan(data);
                    break;
                case 'TokenInvalid':
                    that.handleTokenInvalid();
                    break;
            }
        });

        this.socket.addEventListener('close', function(event){
            that.setState({ connecting: true });
        });

        
    }

    render = () => {
        if(this.state.connecting){
            return <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center'}} ><div style={{ width: this.props.size, height:this.props.size}} dangerouslySetInnerHTML={{ __html: loading }}></div></div>
        }
        else{
            return <Qrcode ref={ this.qrcode } refresh={ this.refresh }
            token={ this.state.token } url={this.props.url} queryStr={this.props.queryStr}
            scannedRenderText={ this.props.scannedRenderText }
            bgColor={this.props.bgColor} fgColor={this.props.fgColor} imageSettings={this.props.imageSettings}
            scannedRender={ this.props.scannedRender } size={ this.props.size }
            ></Qrcode>
        }
        
    }
}

export default QrcodeScanner;

