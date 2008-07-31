/**
    @fileOverview 
      It all starts with the Model. Just like in Rails, the model should really only deal with data and methods surrounding data. It shouldn't interact with the UI or (and this is up for debate) the server. Things like pagination, etc should be handled in the controller.
    @example
      MBX.MyModel = MBX.JsModel.create("MyModel");
    @author  <a href="mailto:topper@motionbox.com">Topper Bowers</a>
    @version 0.1  
*/

if (!("MBX" in window)) {
    /** @namespace
        @ignore
    */
    MBX = {};
}

/** 
    use this as a more convienient (sometimes) method instead of .prototype.blah.prototype chaining.  It tends
    to be a real javascript way of sub-classing
    
    @parm {Object} o the original object
    @returns a new object with the original object as a prototype
*/
MBX.Constructor = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
};

/**
    Use this to create instances of models and extend all models (and instances of all models)
    @namespace
*/
MBX.JsModel = (function () {
    /**
        @memberof MBX.JsModel
        @namespace
    */
    var publicObj = {};
    var currentGUID = 0;
    
    /** used internally to prevent name collision 
        @private
    */
    var modelCache = {};
    
    /**
        Instances of a Model
        @name JsModel#instance
        @class A single instance of a Model
        @see MBX.Constructor
    */
    var oneJsModelInstance = 
        /** @lends JsModel#instance */
        {
        /**
            Use this to set attributes of an instance (rather than set them directly).
            It will automatically create events that will be relevant to controllers
            @param {String} key the key of the attribute
            @param value the value to be assigned to the attribute
            @example
              modelInstance.set('myAttr', 'foo');
              modelInstance.get('myAttr', 'foo');
        */
        set: function (key, value) {
            var changed = false;
            if (this.attributes[key] != value) {
                changed = true;
            }
            this.attributes[key] = value;
            if (changed) {
                MBX.EventHandler.fireCustom(MBX, this.parentClass.Event.changeInstance, {
                    object: this,
                    key: key
                });
            }
        },
        /**
            Use this to retreive attributes on an object (rather than accessing them directly);
            @param {String} key
            @example
              modelInstance.set('myAttr', 'foo');
              modelInstance.get('myAttr', 'foo');
        */
        get: function (key) {
            return this.attributes[key];
        },
        
        /**
            Take an Object literal and update all attributes on this instance
            @param {Object} obj the attributes to update as key, value
        */
        updateAttributes: function (obj) {
            obj = obj || {};
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    this.set(k, obj[k]);
                }
            }
        },
        
        /**
            You should always use this to refer to instances.
            Model.find uses this to grab objects from the instances 
            @returns returns the primaryKey of the instance
            @see JsModel.find
        */
        primaryKey: function () {
            if (this.parentClass.primaryKey) {
                return this.get(this.parentClass.primaryKey);
            } else {
                return this.GUID;
            }
        },
        
        /**
            destroy this instance - works just like rails #destroy will fire off the destroy event as well
            controllers will receive this event by default
        */
        destroy: function () {
            delete this.parentClass.instanceCache[this.primaryKey()];
            MBX.EventHandler.fireCustom(MBX, this.parentClass.Event.destroyInstance, { object: this });
        },
        /** @private */
        _createGUID: function () {
            this.GUID = this.parentClass.modelName + "_" + MBX.JsModel.nextGUID();
        }
    };
    
    /** 
        @class the prototype of a Model
        @constructor
        @throws an error if there's no name, a name already exists or you specified a primaryKey and it wasn't a string
    */
    JsModel = function (name, opts) {
        opts = opts || {};
        if (!name) {
            throw new Error("A name must be specified");
        }
        if (modelCache[name]) {
            throw new Error("A model by that name exists");
        }
        if (opts.primaryKey && (typeof opts.primaryKey != "string")) {
            throw new Error("primaryKey specified was not a string");
        }
        Object.extend(this, opts);
        /** the model name of this model
            @type String
        */
        this.modelName = name;
        /** the instances of this model
            @private
        */
        this.instanceCache = {};
        
        this.prototypeObject = MBX.Constructor(oneJsModelInstance);
        /**
            instances get their parentClass assigned this model
            @name JsModel#instance.parentClass
            @type JsModel
        */
        this.prototypeObject.parentClass = this;
        
        /** events that this model will fire. Use this to hook into (at a very low level) events
            @example
              MBX.EventHandler.subscribe(MBX.cssClass, MyModel.Event.newInstance, function (instance) { // dostuff } );
        */
        this.Event = {
            newInstance: this.modelName + "_new_instance",
            changeInstance: this.modelName + "_change_instance",
            destroyInstance: this.modelName + "_destroy_instance"
        };
        
        /** add an instanceMethods attribute to the passed in attributes in order to extend
            all instances of this model.  You can also specify default attributes by adding
            a defaults attribute to this attribute.
            @type Object
            @name JsModel.instanceMethods
            @example
              MyModel = MBX.JsModel.create("MyModel", {
                  instanceMethods: {
                      defaults: {
                          myAttribute: "myDefault"
                      },
                      myMethod: function (method) {
                          return this.get('myAttribute');
                      }
                  }
              });
              MyModel.create().myMethod() == "myDefault";
        */
        if (opts.instanceMethods) {
            Object.extend(this.prototypeObject, opts.instanceMethods);
        }
        
        modelCache[name] = this;
        
        MBX.EventHandler.fireCustom(MBX, "new_model", {
            object: this
        });
    };
    
    JsModel.prototype = {
        /**
            Create an instance of the model
            @param {Object} attrs attributes you want the new instance to have
            @returns JsModel#instance
            @example
              MyModel = MBX.JsModel.create("MyModel");
              var instance = MyModel.create({
                  myAttr: 'boo'
              });
              instance.get('myAttr') == 'boo';
        */
        create: function (attrs) {
            attrs = attrs || {};
            var obj = MBX.Constructor(this.prototypeObject);
            
            obj.attributes = {};
            if (obj.defaults) {
                Object.extend(obj.attributes, obj.defaults);
            }
            Object.extend(obj.attributes, attrs);
            
            if (this.validateObject(obj)) {
                obj._createGUID();
                this.cacheInstance(obj);
                obj.errors = null;
                MBX.EventHandler.fireCustom(MBX, this.Event.newInstance, {
                    object: obj
                });
                if (typeof obj.afterCreate == "function") {
                    obj.afterCreate();
                }
                return obj;
            } else {
                throw new Error("trying to create an instance with the same primary key as another instance")
            }
        },
        
        /** this method to get extended later.  Used mostly internally.  Right now it only verifies
            that a primaryKey is allowed to be used
            @param {JsModel#instance} instance the instance that's being validated
        */
        validateObject: function (instance) {
            // temporarily - this only will validate primary keys
            if (this.primaryKey) {
                if (!instance.get(this.primaryKey)) {
                    return false;
                }
                if (this.find(instance.get(this.primaryKey))) {
                    return false;
                }
            }
            
            return true;
        },
        
        /** use this to extend all instances of a single model
            @param {Object} attrs methods and attributes that you want to extend all instances with
        */
        extendInstances: function (attrs) {
            /** @default {} */
            attrs = attrs || {};
            Object.extend(this.prototypeObject, attrs);
        },
        
        /** store the instance into the cache. this is mostly used internally
            @private
        */
        cacheInstance: function (instance) {
            if (this.primaryKey) {
                this.instanceCache[instance.get(this.primaryKey)] = instance;
            } else {
                this.instanceCache[instance.GUID] = instance;
            }
        },
        
        /** find a single instance
            @param {String} primaryKey a JsModel#instance primaryKey
            @returns an instance of this element
            @see JsModel#instance.primaryKey
        */
        find: function (primaryKey) {
            return this.instanceCache[primaryKey];
        },
        
        /** @returns all instances of this model */
        findAll: function () {
            return $H(this.instanceCache).values();
        },
        
        // does this belong in the views?
        /** given a domElement with certain classes - return the instance that it belongs to
            @param {DomElement} el the element which has the correct classes on it
            @returns an instance of this model or null
        */
        findByElement: function (el) {
            el = $(el);        
            var modelCss = MBX.JsTemplate.cssFromModel(this);
            if (el.hasClassName(modelCss)) {
                var match = el.className.match(new RegExp(modelCss + "_([^\\s$]+)"));
                var returnInstance;
                if (match) {
                    $H(this.instanceCache).each(function (pair) {
                        if (pair.key.gsub(/[^\w\-]/, "_").toLowerCase() == match[1]) {
                            returnInstance = pair.value;
                        }
                    });
                }
                return returnInstance;
            }
        },
        
        /** Gives back the number of cached instances stored in this model
            @returns {number} number of instances   */
        count: function () {
            return this.findAll().length;
        }
    };
    
    publicObj.Event = {
        newModel: "new_model"
    };
    
    /**
        Used for creating a new JsModel
        @name MBX.JsModel.create
        @function
        
        @param {String} name model name used to prevent name collision
        @param {Object} opts defaults to {}
        
        @constructs
        @example
          var MyModel = MBX.JsModel.create("MyModel");
          var instance = MyModel.create();
    */
    publicObj.create = function (name, opts) {
        return new JsModel(name, opts);
    };
    
    /**
       Used internally to find the next GUID
       @private
    */
    publicObj.nextGUID = function () {
        return currentGUID++;
    };
    
    /**
        Extends all JsModels
        @name MBX.JsModel.extend
        @function
        @param {Object} methsAndAttrs the methods and attributes to extend all models with
    */
    publicObj.extend = function (methsAndAttrs) {
        methsAndAttrs = methsAndAttrs || {};
        Object.extend(JsModel.prototype, methsAndAttrs);
    };
    
    /**
        Extend all instances of all models
        @name MBX.JsModel.extendInstancePrototype
        @function
        @param {Object} methsAndAttrs the methods and attributes to extend all models' instances with
    */
    publicObj.extendInstancePrototype = function (methsAndAttrs) {
        Object.extend(oneJsModelInstance, methsAndAttrs);
    };
    
    /**
           Destroy a controller and unsubscribe its event listeners
           @param {String} name the name of the controller
           @name MBX.JsController.destroyModel
           @function
   */
    publicObj.destroyModel = function (name) {
        delete modelCache[name];
    };
    
    return publicObj;
})();
