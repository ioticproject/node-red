const {api} = require("../api");
module.exports = function(RED) {

    function ActorNode(config) {
        RED.nodes.createNode(this,config);

        let node = this;
        
        node.on('input', function({payload}) {
            api.publish(config.device + "." + config.actor, payload)
        });
    }

    RED.nodes.registerType("actor",ActorNode);
}