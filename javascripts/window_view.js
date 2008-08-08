AirGrowl.WindowView = (function () {
    var self = {};
    
    self.nativeWindow = function (win) {
        var options = new air.NativeWindowInitOptions();
        options.transparent = false;
        options.systemChrome = air.NativeWindowSystemChrome.STANDARD;
        options.type = air.NativeWindowType.NORMAL;

        var windowBounds = new air.Rectangle((MBX.Window.screenRight() - win.get('width') - 10), win.get('yLocation'), win.get('width'), win.get('height'));
        newHTMLLoader = air.HTMLLoader.createRootWindow(true, options, true, windowBounds);
        newHTMLLoader.load(new air.URLRequest("blank_window.html"));
        return newHTMLLoader;
    };
    
    self.customWindow = function (win) {
        AirGrowl.log("template: yLocation = " + win.get("yLocation"));
        var options = new air.NativeWindowInitOptions();
        options.transparent = true;
        options.systemChrome = "none";
        options.type = air.NativeWindowType.LIGHTWEIGHT;
        
        var windowBounds = new air.Rectangle((MBX.Window.screenRight() - win.get('width') - 10), win.get('yLocation'), win.get('width'), win.get('height'));
        newHTMLLoader = air.HTMLLoader.createRootWindow(true, options, true, windowBounds);
        newHTMLLoader.load(new air.URLRequest("blank_window.html"));
        newHTMLLoader.paintsDefaultBackground = false;
        return newHTMLLoader;
    };
    
    self.defaultWindow = function (win) {
        win.set("styles", "default");
        return self.customWindow(win);
    };
    
    return self;
})();

MBX.JsTemplate.create('window_native', AirGrowl.WindowView.nativeWindow);
MBX.JsTemplate.create('window_custom_window', AirGrowl.WindowView.customWindow);
MBX.JsTemplate.create('window_default', AirGrowl.WindowView.defaultWindow);
