
class Util{

    scan = (psn, token, callback) => {
        const socket = new WebSocket(psn);

        socket.addEventListener('open', function (event) {
            var data = {
                type: 'Scan',
                data: {
                    token: token
                }
            }
            socket.send(JSON.stringify(data));
        });

        // Listen for messages
        socket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data);
            callback(data.status, data.error);
        });
    }
}

export default Util;