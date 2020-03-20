import React from 'react';
import { RedoOutlined } from '@ant-design/icons';
import QRCode  from 'qrcode.react';

class Qrcode extends React.Component{

    constructor(props){
        super(props);

        this.state = { token: this.props.token , scan: false, invalid: false }

        this.scannedText = this.props.scannedRenderText ? this.props.scannedRenderText : '已绑定';
        this.size = this.props.size ? this.props.size : 128;
    
        this.scannedRender = typeof this.props.scannedRender == 'undefined' ? true : this.props.scannedRender;
    }

    scan = () => {
        this.setState( { scan: true, invalid: false } );
    }

    invalid = () => {
        this.setState({ scan: false, invalid: true});
    }

    valid = () => {
        this.setState({ scan: false, invalid: false});
    }

    render = () => {
        let url = this.props.url + "?token=" + this.props.token;
        if(this.props.queryStr){
            url += "&" + this.props.queryStr;
        }

        let content = '';
        if(this.state.scan && this.scannedRender){
            content = <p style={{ color: "#5cb85c", fontWeight: "bold", fontSize: this.size / 8}}>{ this.scannedText }</p>;
        }
        else if(this.state.invalid){
            content = <div onClick={this.props.refresh} style={{ width: this.size, height: this.size,
                position:'absolute', top :'0px',left: '50%',
                backgroundColor: '#000', opacity:0.8,
                marginLeft: -(this.size / 2), cursor:'pointer' }} >
                <RedoOutlined style={{ color: 'white', paddingTop: '25%', fontSize: this.size / 4}} />
                <p style={{ color: 'white', fontSize: this.size / 16 }}>已失效,点击刷新</p>
            </div>;
        }

        return <div style={{ textAlign: "center", position: 'relative'}}>
                <QRCode value={url} size={this.size} bgColor={this.props.bgColor} 
                fgColor={this.props.fgColor} imageSettings={this.props.imageSettings} />
                {content}
            </div>

    }
}

export default Qrcode;