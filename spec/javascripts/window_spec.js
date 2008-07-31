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
        
        describe('instances', function () {
            var win;
            
            before(function () {
                win = AirGrowl.Window.create();
            });
            
            it('should have the proper defauls', function () {
                expect(win.get("width")).to(equal, 300);
                expect(win.get("height")).to(equal, 125);
                expect(win.get("type")).to(equal, "native");
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
                  var el = new Element("p");
                  win.setContent(el);
                  expect(win.get('content')).to(equal, el); 
               });
               
            });
            
        });
        
    });
});
