AirGrowl.Window = MBX.JsModel.create("Window", {
    screenRight: function () {
        return air.Screen.mainScreen.bounds.width;
    },
    screenTop: function () {
        return air.Screen.mainScreen.bounds.height;
    },
    instanceMethods: {
        defaults: {
            width: 300,
            height: 125,
            type: "native",
            ready: false
        },
        afterCreate: function () {
            var markAsReady = function () {
                this.set('ready', true);
            }
            
            this.set('open', true);
            this.set('nativeWindow', MBX.JsTemplate.render("window_" + this.get('type'), this));
            this.get('nativeWindow').addEventListener(air.Event.COMPLETE, markAsReady.bind(this));
        },
        updateContent: function () {
            var content = this.get('nativeWindow').window.document.getElementById("content");
            content.appendChild(this.get('content'));
        }
    }
});
