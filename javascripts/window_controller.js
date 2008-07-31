AirGrowl.WindowController = MBX.JsController.create("WindowController", {
    model: AirGrowl.Window,
    
    openNativeWindow: function (win) {
        var markAsReady = function () {
            win.set('ready', true);
        }
        win.set('open', true);
        win.set('nativeWindow', MBX.JsTemplate.render("window_" + win.get('type'), win));
        win.get('nativeWindow').addEventListener(air.Event.COMPLETE, markAsReady);
    },
    
    loadContentIntoWindow: function (win) {
        if (!(win.get('content')) || !(win.get('nativeWindow'))) {
            throw new Error("you must have content and a nativeWindow");
        }
        
        var content = win.get('nativeWindow').window.document.getElementById("content");
        content.appendChild(win.get('content'));
    },
    
    onInstanceChange: function (win, key) {
        if ((key == "ready" && win.get('content')) || (key == "content" && win.get('ready'))) {
            this.loadContentIntoWindow(win);
        } else {
            if (key == "content" && !win.get('nativeWindow')) {
                this.openNativeWindow(win);
            }
        }
    },
    
    onInstanceCreate: function (win) {
        this.renderNothing = true;
    }
    
});
