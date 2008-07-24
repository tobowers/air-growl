AirGrowl.MessageView = (function() {
    var self = {};
    
    self.message = function (message) {
        return new Element("div", { className: "message" }).update(message.get('content'));
    };
    
    return self;
})();

MBX.JsTemplate.create('message', AirGrowl.MessageView.message);
