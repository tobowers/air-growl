AirGrowl.WindowSlotController = MBX.JsController.create("WindowSlotController", {
    model: AirGrowl.WindowSlot,
    
    onInstanceDestroy: function (slot) {
        AirGrowl.WindowSlot.slots.splice(new Number(slot.primaryKey()), 1, null);
        if (AirGrowl.WindowSlot.windowQueue.length > 0) {
            var nextSlot = AirGrowl.WindowSlot.nextSlot();
            if (typeof nextSlot == 'number') {
                var win = AirGrowl.WindowSlot.windowQueue.length.shift();
                var slot = AirGrowl.WindowSlot.create({
                    'slotIndex': nextSlot.toString(),
                    'win': win
                });
                win.set("yLocation", slot.yLocation());
                win.openNativeWindow();
            }
        }
    }
    
});
