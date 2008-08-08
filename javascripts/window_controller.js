AirGrowl.WindowController = MBX.JsController.create("WindowController", {
    model: AirGrowl.Window,
    
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
    
    obtainWindowSlotAndOpenWindow: function (win) {
        var nextSlot = AirGrowl.WindowSlot.nextSlot();
        if (typeof nextSlot == 'number') {
            var slot = AirGrowl.WindowSlot.create({
                'slotIndex': nextSlot.toString(),
                'win': win
            });
            win.set("yLocation", slot.yLocation());
            win.openNativeWindow();
        } else {
            AirGrowl.WindowSlot.windowQueue.push(win);
        }
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
                this.obtainWindowSlotAndOpenWindow(win);
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
    
    onInstanceDestroy: function (win) {
        if (win.get("slot")) {
            win.get("slot").destroy();
        }
    },
    
    onInstanceCreate: function (win) {
        this.renderNothing = true;
    }
    
});
