AirGrowl.WindowController = MBX.JsController.create("WindowController", {
    model: AirGrowl.Window,
    
    openNativeWindow: function (win) {
        var markAsReady = function () {
            AirGrowl.log('markAsReady called');
            win.get('nativeWindow').removeEventListener(air.Event.COMPLETE, markAsReady);
            AirGrowl.log('setting js window');
            win.set('jsWindow', win.get('nativeWindow').window);
            AirGrowl.log('setting native window');
            
            win.set('nativeWindow', win.get('jsWindow').nativeWindow);
            AirGrowl.log('setting always in front');
            
            win.get('nativeWindow').alwaysInFront = true;
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
        
        var content = win.get('jsWindow').document.getElementById("content");
        content.appendChild(win.get('content'));
        win.startTimer();
    },
    
    loadWindowStyles: function (win) {
        if (!(win.get('styles')) || !win.get('nativeWindow')) {
            throw new Error("you must have styles and a nativeWindow");
        }
        
        var fileName = win.get('styles');
        var head = win.get('jsWindow').document.getElementsByTagName("head")[0];        
        var styleSheet = new Element("link", {
            rel: "stylesheet",
            href: "stylesheets/" + fileName + "/" + fileName + ".css"
        });
        
        head.appendChild(styleSheet);
    },
    
    onInstanceChange: function (win, key) {
        AirGrowl.log("setting " + key + " to: " + win.get(key));
        if (key == "ready") {
            win.get("jsWindow").AirGrowl.windowModelInstance = win;
        };
        
        if ((key == "ready" && win.get('styles')) || (key == "styles" && win.get('ready'))) {
            this.loadWindowStyles(win);
        }
        if ((key == "ready" && win.get('content')) || (key == "content" && win.get('ready'))) {
            this.loadContentIntoWindow(win);
        } else {
            if (key == "content" && !win.get('nativeWindow')) {
                this.openNativeWindow(win);
            }
        }
        
        if (key == "focused") {
            if (win.get('focused')) {
                win.stopTimer();
            } else {
                win.startTimer();
            }
        }
    },
    
    onInstanceCreate: function (win) {
        this.renderNothing = true;
    }
    
});
