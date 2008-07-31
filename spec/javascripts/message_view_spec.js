Screw.Unit(function() {
    describe('MessageView', function () {
        it('should have a message template', function () {
           expect(typeof MBX.JsTemplate.find('message')).to(equal, "function"); 
        });
    });
});
