Screw.Unit(function() {
    describe('WindowSlotController', function () {
        
        it("should listen to events on WindowSlot", function () {
            expect(AirGrowl.WindowSlotController.model).to(equal, AirGrowl.WindowSlot);
        });
        
    });
});
