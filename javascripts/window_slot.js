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
        if (!this.slots) {
            this.createSlots();
        }
        AirGrowl.log(this.slots.length);
        
        if (typeof this.slots[0] == 'undefined') {
            return 0;
        }
        AirGrowl.log(this.slots.length);
        var slotIndex;
        for (var i = 0; i < this.slots.length; i++) {
            AirGrowl.log("testing: " + i);
            if (!this.slots[i]) {
                 AirGrowl.log('got one');
                 slotIndex = i;
                 break;
            }
        }
        return slotIndex;
    },
    
    createSlots: function () {
        this.slots = new Array(parseInt(AirGrowl.Window.screenHeight() / (AirGrowl.Window.windowHeight + 25)));
        AirGrowl.log(this.slots.length)
    },

    instanceMethods: {
    
        afterCreate: function () {
            if (!this.get("win")) {
                throw new Error("you must pass in a window for a window slot");
            }
            
            if (!this.parentClass.slots) {
                this.parentClass.createSlots();
            }
            
            this.parentClass.slots.splice(new Number(this.primaryKey()), 1, this);
            
            this.get('win').set("slot", this);
        },
        
        yLocation: function () {
            var slot = new Number(this.primaryKey());
            return slot * AirGrowl.Window.windowHeight;
        }
    
    }
   
   
});