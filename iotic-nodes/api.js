const WebSocketAsPromised = require('websocket-as-promised');
const W3CWebSocket = require('websocket').w3cwebsocket;

class Api {
    host = "pub-sub-gateway:81"
    token = "red-secret"

    wsp = new WebSocketAsPromised('ws://' + this.host, {
        createWebSocket: url => new W3CWebSocket(url),
        packMessage: data => JSON.stringify(data),
        unpackMessage: data => JSON.parse(data)
    })

    constructor() {
        this.wsp.open()
            .then(() => console.log("PubSub connected!"))
            .catch((e) => console.log(e));
    }

    subscribe(topic, callback) {
        this.wsp.sendPacked({
            event: "subscribe", data: {
                token: this.token, pattern: topic
            }
        })

        this.wsp.onUnpackedMessage.addListener(({data}) => {
            console.log("data received: " + data)
            if (data.topic === topic) {
                callback(data.data)
            }
        })
    }

    publish(topic, data) {
        this.wsp.sendPacked({
            event: "publish", data: {
                token: this.token, pattern: topic, data
            }
        })
    }

}

let api = new Api();

module.exports = {api};
