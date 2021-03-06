Screw.Unit(function() {
    describe('WindowSlotController', function () {
        
        it("should listen to events on WindowSlot", function () {
            expect(AirGrowl.WindowSlotController.model).to(equal, AirGrowl.WindowSlot);
        });
        
        it("should remove the slot from array on destroy", function () {
            var win = AirGrowl.Window.create();
            var slot = AirGrowl.WindowSlot.create({
                slotIndex: '0',
                win: win
            });
            expect(AirGrowl.WindowSlot.slots[0]).to(equal, slot);
            slot.destroy();
            expect(AirGrowl.WindowSlot.slots[0]).to_not(be_true);
        });
        
        it("should pop a window when one is deleted and one is in the queue", function () {
            var win = AirGrowl.Window.create();
            var secondWin = AirGrowl.Window.create();
            var windowCalled = false;
            secondWin.openNativeWindow = function () {
                windowCalled = true;
            }
            AirGrowl.WindowSlot.windowQueue.push(secondWin);
            
            var slot = AirGrowl.WindowSlot.create({
                slotIndex: '0',
                win: win
            });
            
            slot.destroy();
            
            expect(windowCalled).to(be_true);
            
        });
        
    });
});
