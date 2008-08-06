AirGrowl.LocalConnection = (function () {
    var self = {};
    
    self.growl = function (msg, messageype) {
        return AirGrowl.Message.create({
            content: msg
        });
    };
    
    var lc = new air.LocalConnection();
    lc.connect("_AirGrowl");
    lc.allowDomain("*");
    lc.client = self;
    
    AirGrowl.log(lc);
    
    return self;
})();
