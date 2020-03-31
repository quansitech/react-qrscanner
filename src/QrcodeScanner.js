import React from 'react';
import Qrcode from './Qrcode';
import { v4 as uuidv4 } from 'uuid';

const loading = `<svg xmlns="http://www.w3.org/2000/svg" style="margin:auto;background:#fff" width="200" height="200" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" display="block"><g transform="translate(80 50)"><circle r="6" fill="#72cff0" transform="scale(1.36857)"><animateTransform attributeName="transform" type="scale" begin="-0.875s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/><animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.875s"/></circle></g><g transform="rotate(45 -50.355 121.569)"><circle r="6" fill="#72cff0" fill-opacity=".875" transform="scale(1.43107)"><animateTransform attributeName="transform" type="scale" begin="-0.75s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/><animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.75s"/></circle></g><g transform="rotate(90 -15 65)"><circle r="6" fill="#72cff0" fill-opacity=".75" transform="scale(1.49357)"><animateTransform attributeName="transform" type="scale" begin="-0.625s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/><animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.625s"/></circle></g><g transform="rotate(135 -.355 41.569)"><circle r="6" fill="#72cff0" fill-opacity=".625" transform="scale(1.05607)"><animateTransform attributeName="transform" type="scale" begin="-0.5s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/><animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.5s"/></circle></g><g transform="rotate(180 10 25)"><circle r="6" fill="#72cff0" fill-opacity=".5" transform="scale(1.11857)"><animateTransform attributeName="transform" type="scale" begin="-0.375s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/><animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.375s"/></circle></g><g transform="rotate(-135 20.355 8.431)"><circle r="6" fill="#72cff0" fill-opacity=".375" transform="scale(1.18107)"><animateTransform attributeName="transform" type="scale" begin="-0.25s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/><animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.25s"/></circle></g><g transform="rotate(-90 35 -15)"><circle r="6" fill="#72cff0" fill-opacity=".25" transform="scale(1.24357)"><animateTransform attributeName="transform" type="scale" begin="-0.125s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/><animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.125s"/></circle></g><g transform="rotate(-45 70.355 -71.569)"><circle r="6" fill="#72cff0" fill-opacity=".125" transform="scale(1.30607)"><animateTransform attributeName="transform" type="scale" begin="0s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/><animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="0s"/></circle></g></svg>`;

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

