import React from 'react';
import { RedoOutlined } from '@ant-design/icons';
import QRCode  from 'qrcode.react';

class Qrcode extends React.Component{

    constructor(props){
        super(props);

        this.state = { token: this.props.token , scan: false, invalid: false }
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
        if(this.state.scan){
            content = <p style={{ color: "#5cb85c", fontWeight: "bold"}}>已绑定</p>;
        }
        else if(this.state.invalid){
            content = <div onClick={this.props.refresh} style={{ width:'128px', height:'128px',
                position:'absolute', top :'0px',left: '50%',
                backgroundColor: '#000', opacity:0.8,
                margin: '0 0 0 -64px', cursor:'pointer' }} >
                <RedoOutlined style={{ color: 'white', paddingTop: '25%', fontSize: '2em'}} />
                <p style={{ color: 'white'}}>已失效,点击刷新</p>
            </div>;
        }

        return <div style={{ textAlign: "center", position: 'relative'}}>
                <QRCode value={url} />
                {content}
            </div>

    }
}

export default Qrcode;