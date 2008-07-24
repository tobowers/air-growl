AirGrowl.WindowController = MBX.JsController.create("WindowController", {
    model: AirGrowl.Window,
    
    onInstanceCreate: function (win) {
        this.renderNothing = true;
    }
    
});
