Screw.Unit(function() {
    describe('MessageController', function () {
        var win;
        before(function() {
            win = {
                setContent: function (content) {
                    this.content = content;
                },
                set: function (key, value) {
                    this[key] = value;
                }
            };
            
            TH.Mock.obj("AirGrowl.Window", {
                create: function () {
                    return win;
                }
            })
        });
        
        it("should listen to events on message", function () {
            expect(AirGrowl.MessageController.model).to(equal, AirGrowl.Message);
        });
        
        describe("A new message", function () {
            var msg;
            before(function () {
                msg = AirGrowl.Message.create({
                    content: "someContent"
                });
            });
            
            it("should create a window and assign content to it", function () {
                expect(Object.isElement(win.content)).to(be_true);
            });
            
            it("should assign the window to the message", function () {
                expect(msg.get('window')).to(equal, win);
            }); 
            
            it('should assign the message to the window', function () {
                expect(win.message).to(equal, msg);
            });
            
        });
        
    });
});

// this.renderNothing = true;
// 
// var win = AirGrowl.Window.create();
// win.setContent(MBX.JsTemplate.render('message', message));
// message.set('window', win);
// win.set('message', message);
// 
