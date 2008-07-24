AirGrowl.Window = (function () {
    var self = {};
    
    
    
    self.launch = function () {
        var options = new air.NativeWindowInitOptions();
        options.transparent = false;
        options.systemChrome = air.NativeWindowSystemChrome.STANDARD;
        options.type = air.NativeWindowType.NORMAL;

        var windowBounds = new air.Rectangle(200,250,300,400);
        newHTMLLoader = air.HTMLLoader.createRootWindow(true, options, true, windowBounds);
        newHTMLLoader.load(new air.URLRequest("blank_window.html"));
        
    };
    
    return self;
})();
