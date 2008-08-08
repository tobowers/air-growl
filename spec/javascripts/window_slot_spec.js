Screw.Unit(function() {
    describe('WindowSlot', function () {
        var slot;
        var win;
        before(function () {
            TH.Mock.obj("AirGrowl.Window", {
                screenHeight: function () { return 1000 },
                screenRight: function () { return 1000 },
                windowHeight: 25
            });
            win = AirGrowl.Window.create();
            slot = AirGrowl.WindowSlot.create({
                slotIndex: '0',
                win: win
            });
        });
        after(function () {
            win.destroy();
            slot.destroy();
            AirGrowl.WindowSlot.slots = null;
        });
        
        it("should have the model name WindowSlot", function () {
            expect(AirGrowl.WindowSlot.modelName).to(equal, "WindowSlot");
        });
        
        it("should have slotIndex as the primaryKey", function () {
            expect(AirGrowl.WindowSlot.primaryKey).to(equal, "slotIndex");
        });
        
        describe("next slot", function () {
            it("should be 1 with 1 slot in there", function () {
                expect(AirGrowl.WindowSlot.nextSlot()).to(equal, 1);
            });
            
            it("should be nothing with all slots filled", function () {
                slot.destroy();
                AirGrowl.WindowSlot.slots = null;
                AirGrowl.Window.windowHeight = 975;
                slot = AirGrowl.WindowSlot.create({
                    slotIndex: '0',
                    win: win
                });
                expect(AirGrowl.WindowSlot.nextSlot()).to(be_undefined);
            });
            
            
        });
        
        describe("numberOfSlotsAvailable", function () {
            it("should return all empty slots in the array", function () {
                expect(AirGrowl.WindowSlot.numberOfSlotsAvailable()).to(equal, 19);
            });
            
            describe("with all slots available", function () {
                before(function () {
                    slot.destroy();
                });
                
                it("should return the screenHeight / windowHeight passed", function () {
                    expect(AirGrowl.WindowSlot.numberOfSlotsAvailable()).to(equal, 20);
                });
                
            });
            
            
            
        });
        
        describe("A new window slot", function () {
            
            it("should add the first slot to the array", function () {
                expect(AirGrowl.WindowSlot.slots[0]).to(equal, slot);
            });
            
            it("should assign itself to the window and assign the window to itself", function () {
                expect(slot.get('win')).to(equal, win);
                expect(win.get('slot')).to(equal, slot);
            });
            
            it("shouldn't create a new windowslot with no defaults", function () {
                var raised = false;
                try {
                    AirGrowl.WindowSlot.create();
                } catch (e) {
                    raised = true;
                }
                expect(raised).to(be_true);
            });
        });
        
    });
});
