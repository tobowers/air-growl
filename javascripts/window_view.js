AirGrowl.WindowView = (function () {
    var self = {};
    
    self.nativeWindow = function (win) {
        var options = new air.NativeWindowInitOptions();
        options.transparent = false;
        options.systemChrome = air.NativeWindowSystemChrome.STANDARD;
        options.type = air.NativeWindowType.NORMAL;

        var windowBounds = new air.Rectangle((MBX.Window.screenRight() - win.get('width')), 0, win.get('width'), win.get('height'));
        newHTMLLoader = air.HTMLLoader.createRootWindow(true, options, true, windowBounds);
        newHTMLLoader.load(new air.URLRequest("blank_window.html"));
        return newHTMLLoader;
    };
    
    return self;
})();

MBX.JsTemplate.create('window_native', AirGrowl.WindowView.nativeWindow);
