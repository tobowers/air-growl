AirGrowl.MessageController = MBX.JsController.create("Message", {
    model: AirGrowl.Message,
    
    onInstanceCreate: function (message) {
        this.renderNothing = true;
        
        var populateWindow = function () {
            var content = win.window.document.getElementById("content");
            AirGrowl.log('populating');
            AirGrowl.log(win.loaded);
            AirGrowl.log(content);
            AirGrowl.log(MBX.JsTemplate.render('message', message).toString());
            content.appendChild(MBX.JsTemplate.render('message', message));
        };
        
        var win = AirGrowl.Window.launch();
        win.addEventListener(air.Event.COMPLETE, populateWindow);
        AirGrowl.log(win);
        AirGrowl.log(win.loaded);

    }
    
});
