AirGrowl.MessageController = MBX.JsController.create("Message", {
    model: AirGrowl.Message,
    
    onInstanceCreate: function (message) {
        this.renderNothing = true;
        
        var win = AirGrowl.Window.create();
        win.setContent(MBX.JsTemplate.render('message', message));
        message.set('window', win);
        win.set('message', message);
    }
    
});
