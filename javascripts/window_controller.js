AirGrowl.WindowController = MBX.JsController.create("WindowController", {
    model: AirGrowl.Window,
    
    onInstanceChange: function (win, key) {
        if (key == "ready" && win.get('content')) {
            win.updateContent()
        }
        if (key == "content" && win.get('ready')) {
            win.updateContent();
        }
    },
    
    onInstanceCreate: function (win) {
        this.renderNothing = true;
    }
    
});
