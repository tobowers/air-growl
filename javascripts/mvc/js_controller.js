if (!("MBX" in window)) {
    /** @namespace */
    MBX = {};
}

/**
    Create and extend controllers
    @namespace
    @requires MBX.JsModel
    @requires MBX.EventHandler
*/
MBX.JsController = (function () {
    /**
        public methods of JsController
        @memberof MBX.JsController
        @namespace
    */
    var publicObj = {};
    
    /**
        used to cache instances of controllers and stop name collisions
        @memberof MBX.JsController
        @private
    */
    var controllerCache = {};
    
    
    /** @private */
    var jsElementClass = '.js_updateable';
    
    /**
        for creating a controller
        @class prototype of all controllers
    */
    JsController = function (name, opts) {
        /**
            @default {}
        */
        opts = opts || {};
        if (!name) {
            throw new Error("A name must be specified");
        }
        if (controllerCache[name]) {
            throw new Error("A controller by that name exists");
        }
        
        this.controllerName = name;
        Object.extend(this, opts);
        if (opts.model) {
            this._subscribeToEvents();
            this.modelClass = MBX.JsTemplate.cssFromModel(this.model);
        }
        controllerCache[name] = this;
        
        MBX.EventHandler.fireCustom(MBX, publicObj.Event.newController, {
            object: this
        });
    };
    
    JsController.prototype = 
        /** @lends JsController */
        {
        /**
            @private
            @requires MBX.JsModel
            @requires this.model
            @requires MBX.JsTemplate
        */
        _onInstanceChange: function (evt) {
            this.setDefaultViewOptions();
            if (this.onInstanceChange) {
                this.onInstanceChange(evt.object, evt.key);
            }

            if ((!this.renderNothing) && this.templateToRender) {                
                this.renderChangeUpdates(evt.object, evt.key);
            }
        },
        
        /**
            @private
            @requires MBX.JsModel
            @requires this.model
            @requires MBX.JsTemplate
        */
        _onInstanceCreate: function (evt) {
            this.setDefaultViewOptions();
            
            if (this.onInstanceCreate) {
                this.onInstanceCreate(evt.object);
            }           
            
            if ((!this.renderNothing) && this.templateToRender) {
                        
                this.renderCreateUpdates(evt.object);
            }
        },
        
        /**
            @private
            @requires MBX.JsModel
            @requires this.model
            @requires MBX.JsTemplate
        */
        _onInstanceDestroy: function (evt) {
            this.setDefaultViewOptions();
            if (this.onInstanceDestroy) {
                this.onInstanceDestroy(evt.object);
            }
            if (!this.renderNothing) {                
                this.renderDestroy(evt.object);
            }
        },
        
        /**
            You can overwrite this method if you want to handle default changeUpdates differently
            @param {JsModel#instance} instance the instance that changed
            @requires MBX.JsModel
            @requires this.model
            @requires MBX.JsTemplate
        */
        renderChangeUpdates: function (instance) {
            var elsToUpdate = this.elementsToUpdate;
            if (!elsToUpdate) {
                var findString = this._instanceFindString(instance);
                elsToUpdate = $$(findString);
            }

            if (elsToUpdate) {
                elsToUpdate.each(function (el) { 
                    el.update(MBX.JsTemplate.render(this.templateToRender, instance));
                }.bind(this));
            }
        },
        
       // Todo: refactor this create method to better handle the way you would *really* want a collectio nto work
       //             - existing element stuff is ugly
       /**
            Overwrite this method to handle model create events differently
            @param {JsModel#instance} instance the instance that was created
            @requires MBX.JsModel
            @requires this.model
            @requires MBX.JsTemplate
       */
        renderCreateUpdates: function (instance) {
            var collsToUpdate = this.collectionsToUpdate;
            if (!collsToUpdate) {
                var findString = [jsElementClass, '.' , this.modelClass, '.collection'].join('');
                collsToUpdate = $$(findString);
            }
            if (collsToUpdate) {
                collsToUpdate.each(function (collection) {
                    var elClass = [jsElementClass, ' ', this.modelClass, ' ', MBX.JsTemplate.cssFromInstance(instance)].join('').gsub(/\./, "");
                    var elToInsert = new Element('div', { className: elClass });
                    elToInsert.update(MBX.JsTemplate.render(this.templateToRender, instance));
                    var collectionId = collection.identify();
                    
                    var existingElements = $$(["#", collectionId, " .", this.modelClass, '.', MBX.JsTemplate.cssFromInstance(instance)].join(''));
                    if (existingElements.length > 0) {
                        existingElements.each(function (el) {
                            el.replace(elToInsert);
                        });
                    } else {
                        collection.insert({ bottom: elToInsert });
                    }
                }.bind(this));
            }
        },
        
        /**
             Overwrite this method to handle model destroy events differently
             @param {JsModel#instance} instance the instance that was destroyed
             @requires MBX.JsModel
             @requires this.model
             @requires MBX.JsTemplate
        */
        renderDestroy: function (instance) {
            var elsToDestroy = this.elementsToDestroy;
            if (!elsToDestroy) {
                var findString = this._instanceFindString(instance);
                elsToDestroy = $$(findString);
            }
            if (elsToDestroy) {
                elsToDestroy.each(function(el) {
                    el.remove();
                });
            }
        },
        
        /**
             setDefaultViewOptions is usually used internally to setup each model event as a new "request"
             you can overwrite this if you want to handle things differently
             @requires MBX.JsModel
             @requires this.model
             @requires MBX.JsTemplate
             @example
               MyController = MBX.JsController.create('MyController', {
                   setDefaultViewOptions: function () {
                          this.renderNothing = true;
                    }
               });
               // this will default MyController to never render anything
             
               
        */
        setDefaultViewOptions: function () {
            this.templateToRender = this._defaultTemplateOrNull();
            this.renderNothing = false;
            this.elementsToUpdate = null;
            this.collectionsToUpdate = null;
            this.elementsToDestroy = null;
        },
        
        /**
            @private
            @requires MBX.JsModel
        */
        _instanceFindString: function (instance) {
            return [jsElementClass, '.', this.modelClass, '.', MBX.JsTemplate.cssFromInstance(instance)].join('');
        },
        
        /**
            @private
            @requires MBX.JsModel
            @requires this.model
            @requires MBX.JsTemplate
        */
        _defaultTemplateOrNull: function () {
            if (MBX.JsTemplate.find(this.modelClass)) {
                return this.modelClass;
            }
        },
        
        /**
            @private
            @requires MBX.JsModel
            @requires this.model
            
        */
        _subscribeToEvents: function () {
            var changeEvent = this.model.Event.changeInstance;
            var newEvent = this.model.Event.newInstance;
            var destroyEvent = this.model.Event.destroyInstance;

            this.eventSubscriptions = [];
            this.eventSubscriptions.push(MBX.EventHandler.subscribe(MBX, changeEvent, this._onInstanceChange.bind(this)));
            this.eventSubscriptions.push(MBX.EventHandler.subscribe(MBX, newEvent, this._onInstanceCreate.bind(this)));
            this.eventSubscriptions.push(MBX.EventHandler.subscribe(MBX, destroyEvent, this._onInstanceDestroy.bind(this)));
        },
        
        /**
            @private
            @requires MBX.JsModel
            @requires this.model
        */
        _unsubscribeToEvents: function () {
            if (this.eventSubscriptions && this.eventSubscriptions[0]) {                
                this.eventSubscriptions.each(function (subscription) {
                    MBX.EventHandler.unsubscribe(subscription);
                });
            }
        }
    };
    
    /**
        This is mostly used internally and is fired on MBX everytime a controller is created
        @memberOf MBX.JsController
    */
    publicObj.Event = {
        newController: "new_controller"
    };
    
    /**
        call extend() to add methods and/or attributes to ALL controllers
        @param {Object} methsAndAttrs
        @name MBX.JsController.extend
        @function
    */
    publicObj.extend = function (methsAndAttrs) {
        methsAndAttrs = methsAndAttrs || {};
        Object.extend(JsController.prototype, methsAndAttrs);
    };
    
    /**
        Controllers allow some decently powerful hooks. You can specify a model, and an
        onAfterCreate, onInstanceChange, onInstanceDestroy, onInstanceCreate
          
        @name MBX.JsController.create
        @param {String} name the name of the controller
        @param {Object} opts used to extend the controller methods at instantiation
        @see JsController
        @function
        @example
          MBX.DesktopUploadController = MBX.JsController.create("DesktopUpload", {
              ANewMethod: function (something) {
                  return something;
              }
          })
          MBX.DesktopUpload.ANewMethod("boo") == "boo";
        @example
          MBX.DesktopUploadController = MBX.JsController.create("DesktopUpload", {
              model: MBX.DesktopUpload,
              onInstanceCreate: function (instance) {
                  alert(instance.get('greeting'));
              }              
          });
          MBX.DesktopUpload.create({ greeting: 'hi' });  // will alert('hi');
        @example
          MBX.DesktopUploadController = MBX.JsController.create("DesktopUpload", {
              model: MBX.DesktopUpload,
              onInstanceChange: function (instance) {
                  alert(instance.get('greeting'));
              }              
          });
          var instance = MBX.DesktopUpload.create();
          instance.set('greeting', 'hi');  // will alert('hi')
    */
    publicObj.create = function (name, opts) {
        if (controllerCache[name]) {
            throw new Error("A controller with the name of " + name + " is already in use");
        }
        var controller = new JsController(name, opts);
        if (typeof controller.afterCreate == "function") {
            controller.afterCreate();
        }
        return controller;
    };
    
    /**
        Destroy a controller and unsubscribe its event listeners
        @param {String} name the name of the controller
        @name MBX.JsController.destroyController
        @function
    */
    publicObj.destroyController = function (name) {
        if (controllerCache[name]) {
            controllerCache[name]._unsubscribeToEvents();
            delete controllerCache[name];
        }
    };
    
    return publicObj;
})();
