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
            ready: false,
            open: false
        },
        setContent: function (content) {
            if (Object.isElement(content)) {
                this.set('content', content);
            } else {
                var el = new Element("div").update(content);
                this.set('content', el);
            }
        }
    }
});
