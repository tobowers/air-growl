Screw.Unit(function() {
    describe('Window', function () {
        before(function () {
            TH.insertDomMock("blank_window");
            TH.Mock.obj("MBX.JsTemplate", {
                render: function (template, obj) {
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
        });
        
        it("should respond to screenTop and screenRight", function () {
            expect(typeof AirGrowl.Window.screenTop).to(equal, 'function');
            expect(typeof AirGrowl.Window.screenRight).to(equal, 'function');
        });
        
        it("should properly send open windows", function () {
            var win = AirGrowl.Window.create();
            win.set("open", true);
            expect(AirGrowl.Window.openWindows()[0]).to(equal, win);
        });
        
        describe('instances', function () {
            var win;
            
            before(function () {
                win = AirGrowl.Window.create();
            });
            
            it('should have the proper defaults', function () {
                expect(win.get("width")).to(equal, 300);
                expect(win.get("height")).to(equal, 125);
                expect(win.get("type")).to(equal, "default");
                expect(win.get("ready")).to(be_false);
                expect(win.get("open")).to(be_false);
            });
            
            describe("setContent", function () {
               it("should add a div wrapper when only text is passed in", function () {
                  win.setContent('blah');
                  expect(Object.isElement(win.get('content'))).to(be_true);
                  expect(win.get('content').innerHTML).to(equal, "blah"); 
               });
               
               it("should just use an HTML element if that's passed in ", function () {
                  var el = new Element("p", {id: 'thisOne'});
                  win.setContent(el);
                  expect(win.get('content').id).to(equal, el.id); 
               });
               
            });
            
        });
        
    });
});
