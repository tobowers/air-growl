AirGrowl.Window = (function () {
    var self = {};
    
    var width = 300;
    var height = 125;
    
    var windowRight = function () {
        return air.Screen.mainScreen.bounds.width;
    };
    
    var windowBottom = function () {
        return air.Screen.mainScreen.bounds.height;
    };
    
    self.launch = function () {
        var options = new air.NativeWindowInitOptions();
        options.transparent = false;
        options.systemChrome = air.NativeWindowSystemChrome.STANDARD;
        options.type = air.NativeWindowType.NORMAL;

        var windowBounds = new air.Rectangle((windowRight() - width), 0, width, height);
        newHTMLLoader = air.HTMLLoader.createRootWindow(true, options, true, windowBounds);
        newHTMLLoader.load(new air.URLRequest("blank_window.html"));
        return newHTMLLoader;
    };
    
    return self;
})();
