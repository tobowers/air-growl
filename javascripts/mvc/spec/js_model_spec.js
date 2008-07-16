Screw.Unit(function() {
    describe('MBX.JsModel', function() {
        var MyModel, PrototypeTestModel;
        after(function () {
            MBX.JsModel.destroyModel("MyModel");
        });
        
        it("should have an event constant for new_model", function () {
            expect(MBX.JsModel.Event.newModel).to_not(be_null);
        });
        
        it("should allow you to specify an afterCreate that gets executed after an instance is created", function () {
            MyModel = MBX.JsModel.create("MyModel", {
                instanceMethods: {
                    afterCreate: function () {
                        this.set('aFunctionDefinedAttribute', "cool");
                    }
                }
            });
            var instance = MyModel.create();
            expect(instance.get('aFunctionDefinedAttribute')).to(equal, "cool");
        });
        
        it("should allow default instance attributes", function () {
            MyModel = MBX.JsModel.create("MyModel", {
                instanceMethods: {
                    defaults: {
                        myAttr: "cool"
                    }
                }
            });
            
            expect(MyModel.create().get('myAttr')).to(equal, "cool");
        });
                
        describe("a new model", function () {
            before(function () {
                TH.countEvent(MBX.JsModel.Event.newModel);
                MyModel = MBX.JsModel.create('MyModel');
            });
            
            it("should have the modelName that was passed to it", function () {
                expect(MyModel.modelName).to(equal, "MyModel");
            });
            
            it("should have constants for new_instance, instance_change events", function (){ 
                expect(MyModel.Event.newInstance).to_not(be_null);
                expect(MyModel.Event.changeInstance).to_not(be_null);
            });
            
            it("should fire a new model event", function () {
                expect(TH.eventCountFor(MBX.JsModel.Event.newModel)).to(equal, 1);
            });
            
            it("should respond to create", function () {
                expect(typeof MyModel.create()).to(equal, "object"); 
            });
            
            it("should have the correct event names", function () {
                expect(MyModel.Event.changeInstance).to(match, /^MyModel_/);
                expect(MyModel.Event.newInstance).to(match, /^MyModel_/)     
            });
            
            it("should allow extentions of only this model", function () {
                MBX.JsModel.destroyModel('MyModel');
                MyModel = MBX.JsModel.create('MyModel', {
                    thisModelOnlyAttr: "cool"
                });
                expect(MyModel.thisModelOnlyAttr).to(equal, "cool");
            });
            
            it("should return findAll as an empty array without any instances", function () {
                expect(MyModel.findAll()).to(equal, []);
            });
            
        });
        
        describe('a model with a primary key other than GUID', function () {
           var instance;
           before(function () {
              MyModel = MBX.JsModel.create('MyModel', {
                  primaryKey: 'nativePath'
              });
              TH.countEvent(MyModel.Event.newInstance);
              instance = MyModel.create({
                  nativePath: "1"
              });
           });
           
           it('should cache the instance by the primary key', function () {
               expect(MyModel.instanceCache[instance.get('nativePath')]).to(equal, instance);
           });
           
           it("should not allow two objects with the same primary key", function () {
               var raised = false;
               try {
                   MyModel.create({ nativePath: "1" });
               } catch (e) {
                   raised = true;
               }
               expect(raised).to(be_true);
           });
           
           it("should respond to primaryKey() with its primary key", function () {
               expect(instance.primaryKey()).to(equal, '1');
           });
           
           it('should allow finds by the primary key', function () {
               expect(MyModel.find('1')).to(equal, instance);
           });
           
        });
        
        describe('a model instance', function () {
           var instance;
           before(function () {
              MyModel = MBX.JsModel.create('MyModel');
              TH.countEvent(MyModel.Event.newInstance);
              instance = MyModel.create();
           });
           
           it("should fire a new instance event", function () {
               expect(TH.eventCountFor(MyModel.Event.newInstance)).to(equal, 1);
           });
           
           it("should have a GUID in the form <ModelName>_<Integer>", function () {
               expect(instance.GUID).to(match, /MyModel_\d+/); 
           });
           
           it("should cache the instance", function () {
               expect(MyModel.instanceCache[instance.GUID]).to(equal, instance);
           });
           
           it("should take attributes at create and allow 'get' to get them", function () {
               expect(MyModel.create({test: 'cool'}).get('test')).to(equal, 'cool');
           });
           
           it("should be found by Model.find", function () {
               expect(MyModel.find(instance.GUID)).to(equal, instance);
           });
           
           it("should respond to primaryKey() with the GUID", function () {
               expect(instance.primaryKey()).to(equal, instance.GUID);
           });
           
           it("should be in the instances returned by findAll", function () {
               expect(MyModel.count()).to(equal, 1);
               expect(MyModel.findAll().include(instance)).to(be_true);
           });
           
           it("should increase the count", function () {
               expect(MyModel.count()).to(equal, 1);
           });
           
           it("should be able to be found by an element with the correct classname", function () {
               var el = new Element("div", {
                   className: (MBX.JsTemplate.cssFromModel(instance.parentClass) + " " + MBX.JsTemplate.cssFromInstance(instance))
               });
               $("dom_test").update(el);
               expect(MyModel.findByElement(el)).to(equal, instance);
           });
           
           describe("destroying an instance", function () {
               var primaryKey;
               before(function () {
                   TH.countEvent(MyModel.Event.destroyInstance);
                   primaryKey = instance.primaryKey();
                   instance.destroy();
               });
               
               it("should adjust the instance count", function () {
                   expect(MyModel.count()).to(equal, 0);
               });
               
               it("should remove the instance from the cache", function () {
                   expect(MyModel.findAll().include(instance)).to(be_false);
                   expect(MyModel.find(primaryKey)).to(be_null);
               });
               
               it("should fire the destroy event", function () {
                   expect(TH.eventCountFor(MyModel.Event.destroyInstance)).to(equal, 1);
               });
               
           });
           
           describe('when updating keys', function () {
               var changeEvent;
               before(function () {
                  changeEvent = MyModel.Event.changeInstance;
                  TH.countEvent(changeEvent);
                  expect(instance.get('myAttr')).to(be_null);
                  instance.set('myAttr', 'cool');
               });
               
               it("should fire a change event", function () {
                   expect(TH.eventCountFor(changeEvent)).to(equal, 1);
               });
               
               it("should set the actual key", function () {
                   expect(instance.get('myAttr')).to(equal, 'cool');
               });
               
               it("should namespace the attributes within the object", function () {
                   // NOTE:  never actually use the code below to access attributes
                   expect(instance.attributes.myAttr).to(equal, "cool");
               });
               
               it("should allow bulk updates using updateAttributes", function () {
                   instance.updateAttributes({
                       myAttr: "super-cool",
                       anotherAttr: "cool" 
                   });
                   expect(instance.get('myAttr')).to(equal, "super-cool");
                   expect(instance.get('anotherAttr')).to(equal, "cool");
               });
               
               it("should not fire a change event if the attribute hasn't changed", function () {
                   instance.set('myAttr', 'cool');
                   // the equal, 1 is from the original set - so this one should not increment it to 2
                   expect(TH.eventCountFor(changeEvent)).to(equal, 1);
               });
           });
           
        });
        
        describe("extending instance methods", function () {
            before(function () {
               MyModel = MBX.JsModel.create("MyModel", {
                   instanceMethods: {
                       anAllInstanceMethod: function () {
                           return true;
                       }
                   }
               }) 
               InstanceMethodTestModel = MBX.JsModel.create("InstanceMethodTestModel");
            });
            
            after(function () {
                MBX.JsModel.destroyModel('InstanceMethodTestModel');
            });
            
            it("should add the method to all instances", function () {
                expect(MyModel.create().anAllInstanceMethod()).to(be_true);
            });
            
            it("should NOT add it to other model's instances", function () {
               expect(InstanceMethodTestModel.create().anAllInstanceMethod).to(be_undefined); 
            });
            
        });
        
        describe("extending JsModel", function () {
            before(function () {
                TH.Mock.obj("MBX.JsModel");
                PrototypeTestModel = MBX.JsModel.create('PrototypeTestModel');
                MyModel = MBX.JsModel.create('MyModel');
            });
            
            after(function () {
                MBX.JsModel.destroyModel("PrototypeTestModel");
            });
             
            it("should allow extentions of all model's prototype", function () {
                MBX.JsModel.extend({
                   newAttr: "cool" 
                });
                expect(MyModel.newAttr).to(equal, "cool");
                expect(PrototypeTestModel.newAttr).to(equal, "cool");
            });

            it("should allow extentions of all model's instance prototypes", function () {
                MBX.JsModel.extendInstancePrototype({
                   newAttr: "cool" 
                });
                expect(MyModel.create().newAttr).to(equal, "cool");
                expect(PrototypeTestModel.create().newAttr).to(equal, "cool");
            });
        });
        
        
    });
});
