import React from 'react';
import Qrcode from './Qrcode';
import { v4 as uuidv4 } from 'uuid';

class QrcodeScanner extends React.Component{

    constructor(props){
        super(props);

        this.qrcode = React.createRef();

        this.state = { token: uuidv4() };

        this.socket = null;

        this.connect();


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
        let url = 'ws://' + this.props.host + ':' + this.props.port;
        this.socket = new WebSocket(url);
        const that = this;
        this.socket.addEventListener('open', function (event) {
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

        
    }

    render = () => {
        return <Qrcode ref={ this.qrcode } refresh={ this.refresh }
        token={ this.state.token } url={this.props.url} queryStr={this.props.queryStr}
        scannedRenderText={ this.props.scannedRenderText }
        bgColor={this.props.bgColor} fgColor={this.props.fgColor} imageSettings={this.props.imageSettings}
        scannedRender={ this.props.scannedRender } size={ this.props.size }
        ></Qrcode>
    }
}

export default QrcodeScanner;

