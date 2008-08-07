AirGrowl.WindowSlotController = MBX.JsController.create("WindowSlotController", {
    model: AirGrowl.WindowSlot,
    
    onInstanceDestroy: function (slot) {
        AirGrowl.WindowSlot.slots.splice(new Number(slot.primaryKey()), 1, null);
    }
    
});
