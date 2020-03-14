import React from 'react';
import ReactDOM from 'react-dom';
import Qrcode from './Qrcode';
import { v4 as uuidv4 } from 'uuid';

class QrcodeScanner extends React.Component{

    constructor(props){
        super(props);

        this.qrcode = React.createRef();

        this.state = { token: uuidv4() };

        this.connect();
    }

    refresh = () => {
        this.setState({ token: uuidv4() });
        this.qrcode.current.valid();
    }

    connect = () => {
        let url = 'ws://' + this.props.host + ':' + this.props.port;
        const socket = new WebSocket(url);
        const that = this;
        socket.addEventListener('open', function (event) {
            let data = {
                type: 'BindToken',
                data: {
                    token: that.state.token
                }
            }
            socket.send(JSON.stringify(data));
        });

        socket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data);
            if(data.status == 1){
                that.qrcode.current.scan();
            }

            if(typeof that.props.scannedCallback == 'function'){
                that.props.scannedCallback();
            }
        });
    }

    render = () => {
        return <Qrcode ref={ this.qrcode } refresh={ this.refresh } token={ this.state.token } url={this.props.url} queryStr={this.props.queryStr}></Qrcode>
    }
}

function qrscanner(id, opt){
    const defaultOpt = { host: '', port: 2346, url: '', queryStr: '', scannedCallback: null};
    Object.assign(defaultOpt, opt);
    ReactDOM.render(<QrcodeScanner url={defaultOpt.url} port={defaultOpt.port} host={defaultOpt.host} queryStr={defaultOpt.queryStr} scannedCallback={defaultOpt.scannedCallback} />, document.getElementById(id));
}

window.qrscanner = qrscanner;

export default QrcodeScanner;