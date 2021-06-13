const {api} = require("../api");

module.exports = function(RED) {

    function SensorNode(config) {
        RED.nodes.createNode(this,config);

        let node = this;

        api.subscribe(config.device + "." + config.sensor, (data) => {
            node.send({payload: data});
        })
    }

    RED.nodes.registerType("sensor",SensorNode);
}