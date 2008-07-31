Screw.Unit(function() {
    describe('WindowView', function () {
        it('should have a window_native template', function () {
           expect(typeof MBX.JsTemplate.find('window_native')).to(equal, "function"); 
        });
    });
});
