Screw.Unit(function() {
    describe('WindowController', function () {
        before(function () {
            TH.insertDomMock("blank_window");
        });
  
        it("should listen to events on AirGrowl.Window", function () {
            expect(AirGrowl.WindowController.model).to(equal, AirGrowl.Window);
        });
        
        it("should render nothing on create", function () {            
            var win = AirGrowl.Window.create();
            expect(AirGrowl.WindowController.renderNothing).to(be_true);
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
                            }
                        }
                    }
                });
                
                //win.set('nativeWindow', window);
                
            });
            
            after(function () {
                win.destroy();
            }); 
            
            it("should render a window when content is added", function () {
                win.set('content', 'some content');
                expect(templateArgs.template).to(equal, "window_" + win.get('type'));
                expect(templateArgs.obj).to(equal, win);
            });
            
            it("should add the content to the window when the window becomes available", function () {
                win.setContent('some content');
                win.set('ready', true);
                expect($('content').down('div').innerHTML).to(equal, 'some content');
            });
            
        });
        
        
    });
});
