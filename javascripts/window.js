AirGrowl.Window = MBX.JsModel.create("Window", {
    screenRight: function () {
        return air.Screen.mainScreen.bounds.width;
    },
    screenTop: function () {
        return air.Screen.mainScreen.bounds.height;
    },
    openWindows: function () {
        var instanceArray = [];
        var inst;
        $H(this.instanceCache).each(function (pair) {
            if (pair.value.get("open")) {
                instanceArray.push(pair.value);
            }
        });
        return instanceArray;
    },
    
    instanceMethods: {
        defaults: {
            width: 300,
            height: 125,
            type: "default",
            ready: false,
            open: false,
            focused: false,
            timeout: 4000
        },
        
        setContent: function (content) {
            if (Object.isElement(content)) {
                this.set('content', content);
            } else {
                var el = new Element("div").update(content);
                this.set('content', el);
            }
        },
        
        close: function () {
            this.get("nativeWindow").close();
            this.set("open", false);
        },
        
        reopen: function () {
            nativeWindow.activate();
            this.set("open", true);
        },
        
        mouseover: function () {
            this.set("focused", true);
        },
        
        mouseout: function () {
            this.set("focused", false);
        },
        
        fadeWindow: function () {
            this.close();
        },
        
        startTimer: function () {
            this.stopTimer();
            this.set("timer", setTimeout(this.fadeWindow.bind(this), this.get('timeout')));
        },
        
        stopTimer: function () {
            if (this.get("timer")) {
                clearTimeout(this.get('timer'));
            }
        }
    }
});
