AirGrowl.WindowSlot = MBX.JsModel.create("WindowSlot", {
    primaryKey: 'slotIndex',

    numberOfSlotsAvailable: function () {
        var count = 0;
        for (var i = 0; i < this.slots.length; ++i) {
            if (!this.slots[i]) {
                count++;
            }
        }
        return count;
    },
    
    nextSlot: function () {
        if (typeof this.slots[0] == 'undefined') {
            return 0;
        }
        for (var i = 0; i < this.slots.length; ++i) {
            if (!this.slots[i]) {
                return i;
            }
        }
    },

    instanceMethods: {
    
        afterCreate: function () {
            if (!this.get("win")) {
                throw new Error("you must pass in a window for a window slot");
            }
            
            if (!this.parentClass.slots) {
                this.parentClass.slots = new Array(AirGrowl.Window.screenHeight() / (AirGrowl.Window.windowHeight + 25));
            }
            
            this.parentClass.slots.splice(new Number(this.primaryKey()), 1, this);
            
            this.get('win').set("slot", this);
        }
    
    }
   
   
});