Screw.Unit(function() {
    describe('WindowController', function () {
        before(function () {
            TH.insertDomMock("blank_window");
        });
  
        it("should listen to events on AirGrowl.Window", function () {
            expect(AirGrowl.WindowController.model).to(equal, AirGrowl.Window);
        });
        
        describe("adding content to a window", function () {
            var win;
            var templateArgs;
            
            before(function () {
                win = AirGrowl.Window.create();
                templateArgs = {};
                
                TH.Mock.obj("MBX.JsTemplate", {
                    render: function (template, obj) {
                        templateArgs.template = template;
                        templateArgs.obj = obj;
                        return { 
                            addEventListener: function () {},
                            window: {
                                document: {
                                    getElementById: function () {
                                        return $("content");
                                    }
                                }
                            },
                            close: function () {}
                        }
                    }
                });
                
                win.set('jsWindow', window);
                
            });
            
            after(function () {
                win.destroy();
            });
            
            it("should render a window when content is added", function () {
                win.set('content', 'some content');
                expect(templateArgs.template).to(equal, "window_" + win.get('type'));
                expect(templateArgs.obj).to(equal, win);
            });
            
            describe("adding content", function () {
                before(function () {
                    win.setContent('some content');
                    win.set('ready', true);
                });              
                
                it("should add the content to the window when the window becomes available", function () {
                    expect($('content').down('div').innerHTML).to(equal, 'some content');
                });
                
                it("should start the close countdown", function () {
                    expect(typeof win.get("timer")).to(equal, "number");
                });
                
            });

            
            describe("focusing and unfocusing a window", function () {
                before(function () {
                    win.set("focused", true);
                });
                
                it("should clear the timer when it's focused", function () {
                    expect(win.get('timer')).to(be_null);
                });
                
                it("should start the timer when it's not focused", function () {
                    win.set("focused", false);
                    expect(typeof win.get("timer")).to(equal, "number");
                });

            });
            
            
            
            describe("the second window", function () {
                var secondWindow;
                before(function () {
                    win.setContent('some content');
                    win.set('ready', true);
                    
                    secondWindow = AirGrowl.Window.create();
                    secondWindow.set("jsWindow", window);
                    secondWindow.setContent('some content');
                    secondWindow.set('ready', true);
                });
                
                after(function () {
                    secondWindow.destroy();
                });
                
                it("should open in the second position", function () {
                    expect(secondWindow.get("yLocation")).to(equal, 25 + win.get('height'));
                });
                
            });
            
        });
        
        
    });
});
