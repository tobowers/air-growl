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
            type: "native"
        },
        afterCreate: function () {
            this.set('open', true);
            this.set('nativeWindow', MBX.JsTemplate.render("window_" + this.get('type'), this));
        }
    }
});
