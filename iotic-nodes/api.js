const WebSocketAsPromised = require('websocket-as-promised');
const W3CWebSocket = require('websocket').w3cwebsocket;

class Api {
    host = "pub-sub-gateway:81"
    // host = "localhost:81";
    token = "red-secret";

    wsp = undefined;

    subscriptions = []

    constructor() {
        this.start()
    }

    start() {

        this.wsp = new WebSocketAsPromised('ws://' + this.host, {
            createWebSocket: url => new W3CWebSocket(url),
            packMessage: data => JSON.stringify(data),
            unpackMessage: data => JSON.parse(data)
        })

        this.wsp.open().then(() => {
            console.log("PubSub connected!");

            let oldSubscriptions = [...this.subscriptions];
            this.subscriptions = [];

            for(let {topic, callback} of oldSubscriptions){
                this.subscribe(topic, callback);
            }
        })

        this.wsp.onClose.addListener((e) => {
            console.log("Restarting: " + e);
            setTimeout(() => this.start(), 2000)
        });
    }

    subscribe(topic, callback) {
        this.subscriptions.push({topic,callback})
        console.log("Subscrbie topic: " + topic);

        if(this.wsp.isOpened) {
            this.wsp.sendPacked({
                event: "subscribe", data: {
                    token: this.token, pattern: topic
                }
            })

            this.wsp.onUnpackedMessage.addListener(({data}) => {
                console.log("data received: " + JSON.stringify(data))
                if (data.topic === topic) {
                    callback(data.data)
                }
            })
        }
    }

    publish(topic, data) {
        if(this.wsp.isOpened) {
            this.wsp.sendPacked({
                event: "publish", data: {
                    token: this.token, pattern: topic, data
                }
            })
        }
    }

}

let api = new Api();

module.exports = {api};
