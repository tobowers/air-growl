Screw.Unit(function() {
    describe('MBX.JsController', function() {
        var MyController;
        after(function () {
           MBX.JsController.destroyController('MyController');
        });
        
        it("should allow the creation of a controller", function () {
            expect(typeof MBX.JsController.create('MyController')).to(equal, "object");
        });
        
        it("should fire a new controller event when creating a controller", function () {
            TH.countEvent(MBX.JsController.Event.newController);
            MyController = MBX.JsController.create("MyController");
            expect(TH.eventCountFor(MBX.JsController.Event.newController)).to(equal, 1);
        });
        
        it("should allow extentions of all controllers", function () {
            TH.Mock.obj("MBX.JsController");
            PrototypeTestController = MBX.JsController.create('PrototypeTestController');
            MyController = MBX.JsController.create('MyController');
            
            MBX.JsController.extend({ newAttr: "cool" });
            
            expect(PrototypeTestController.newAttr).to(equal, "cool");
            expect(MyController.newAttr).to(equal, "cool");
            
            MBX.JsController.destroyController('PrototypeTestController');
        });
        
        it("should call afterCreate if it exists", function () {
            var thisController = MBX.JsController.create("ATestController", {
                afterCreate: function () {
                    this.anAfterCreateAttr = "cool";
                }
            });
            expect(thisController.anAfterCreateAttr).to(equal, "cool");
            MBX.JsController.destroyController("ATestController");
        });
        
        describe("a new controller with a model", function () {
           var MyModel;
           before(function () {
               MyModel = MBX.JsModel.create("MyModel");
           });
           
           after(function () {
               MBX.JsModel.destroyModel('MyModel');
           });
           
           it("should assign its modelClass", function () {
               var MyController = MBX.JsController.create('MyController', {
                     model: MyModel
               });
               expect(MyController.modelClass).to(equal, "mymodel");
           });
           
           it('should subscribe to model events', function () {
               var eventSubscriptions = [];
               var mockedHandler = TH.Mock.obj("MBX.EventHandler");
               mockedHandler.subscribe = function (specifiers, evtTypes, funcs) {
                   eventSubscriptions.push([specifiers, evtTypes]);
               };               
               MyController = MBX.JsController.create('MyController', { model: MyModel });
               
               expect(eventSubscriptions[0]).to(equal, [MBX.cssNamespace, MyModel.Event.changeInstance]);
               expect(eventSubscriptions[1]).to(equal, [MBX.cssNamespace, MyModel.Event.newInstance]);
               expect(eventSubscriptions[2]).to(equal, [MBX.cssNamespace, MyModel.Event.destroyInstance]);
           });
           
           it("should be able to find an instance given a valid DOM element", function () {
               var el = $$(".mymodel .mymodel_")
           });
           
           describe("callbacks", function () {
              var lastCallback, instance;
              before(function () {
                  lastCallback = null;
                  MyController = MBX.JsController.create('MyController', {
                      model: MyModel,
                      onInstanceCreate: function (instance) {
                          lastCallback = instance;
                      },
                      onInstanceChange: function (instance, key) {
                          lastCallback = [instance, key];
                      },
                      onInstanceDestroy: function (instance) {
                          lastCallback = instance;
                      }
                  });
                  instance = MyModel.create();
              });
              
              it("should call onInstanceCreate when a new instance of Model is created", function () {
                  expect(lastCallback).to(equal, instance);
              });
              
              it("should call onInstanceChange when an instance is changed", function () {
                  lastCallback = null;
                  instance.set('AChange', 'IsDifferent');
                  expect(lastCallback).to(equal, [instance, 'AChange']);
              });
              
              it("should call onInstanceDestroy when an instance is destroyed", function () {
                  lastCallback = null;
                  instance.destroy();
                  expect(lastCallback).to(equal, instance);
              });
              
           });
           
           describe("views and templates", function () {
               var Video, instance, mockView;
               var videoTemplate = function (obj) {
                   return ['updated-', obj.get('words')].join("");
               };
               
               before(function () {
                   MBX.JsModel.destroyModel('Video');
                   Video = MBX.JsModel.create("Video", { primaryKey: 'id' });
                   instance = Video.create({
                      id: '1',
                      words: 'cool' 
                   });
               });
               
               describe("with default views and templates", function () {
                   before (function () {
                       VideoController = MBX.JsController.create('VideoController', {
                          model: Video 
                       });
                       MBX.JsTemplate.create('video', videoTemplate);
                   });
                   
                   after (function () {
                       MBX.JsController.destroyController('VideoController');
                   });
               
                   it("should update the view on instance change", function () {
                       TH.insertDomMock("mvc/single_video");
                       instance.set('words', 'different');
                       expect($("mocked_video").innerHTML).to(equal, MBX.JsTemplate.render('video', instance));
                   });
                   
                   it("should remove the view on a destroy", function () {
                       instance.destroy();
                       expect($("mocked_video")).to(be_null);
                   });
                   
                   describe("creating a video", function () {
                       var newInstance;
                        before(function () {
                             TH.insertDomMock("mvc/video_collection");
                             expect($("mocked_video_collection").innerHTML).to_not(match, 'new_instance');
                             newInstance = Video.create({
                                 id: '2',
                                 words: 'new_instance'
                             });
                        });
                        
                        it("should add a video to the collection", function () {
                            expect($("mocked_video_collection").innerHTML).to(match, MBX.JsTemplate.render('video', newInstance));
                        });
                        
                        it("should replace an existing element with the same primaryKey classnames on create if it exists", function () {
                            var el = new Element('div', {className: 'js_updateable video video_2'});
                            newInstance.destroy();
                            expect($("mocked_video_collection").innerHTML).to_not(match, 'new_instance');
                            $("mocked_video_collection").update(el);
                            expect($$('.video.video_2').length).to(equal, 1);
                            
                            newInstance = Video.create({
                                id: '2',
                                words: 'new_instance'
                            });
                            expect($$('.video.video_2').length).to(equal, 1);
                            expect($("mocked_video_collection").innerHTML).to(match, 'new_instance');
                        });     
                   });
                   
               }); 
               
               describe("with a model that uses a non-standard primaryKey", function () {
                   var newInstance;
                   
                   before (function () {
                       VideoController = MBX.JsController.create('VideoController', {
                          model: Video
                       });
                       MBX.JsTemplate.create('video', videoTemplate);
                       TH.insertDomMock("mvc/video_collection");
                       
                       newInstance = Video.create({
                           id: 'My/Weird/Primary Key',
                           words: 'new_instance'
                       });
                       expect($("mocked_video_collection").innerHTML).to(match, MBX.JsTemplate.render('video', newInstance));
                       
                   });
                   
                   after (function () {
                       MBX.JsController.destroyController('VideoController');
                   });
               
                   it("should be able to refind that instance and update it", function () {
                       instance.set('words', 'different');
                       expect($("mocked_video_collection").innerHTML).to(match, MBX.JsTemplate.render('video', newInstance));
                   })
               });
               
               describe("custom template handling", function () {
                   before (function () {
                       MBX.JsController.destroyController('VideoController');
                       VideoController = MBX.JsController.create('VideoController', {
                           model: Video,
                           onInstanceChange: function (instance) {
                               this.templateToRender = 'video2';
                           },
                           onInstanceCreate: function (instance) {
                               this.templateToRender = 'video2';
                           },
                           onInstanceDestroy: function (instance) {
                               this.renderNothing = true;
                           }
                       });
                       MBX.JsTemplate.create('video2', videoTemplate);
                   });
                   
                   it("should use the custom template on an update", function () {
                       TH.insertDomMock("mvc/single_video");
                       instance.set('words', 'different');
                       expect($("mocked_video").innerHTML).to(equal, MBX.JsTemplate.render('video', instance));
                   });
                   
                   it("should use the custom template on a create", function () {
                       TH.insertDomMock("mvc/video_collection");
                       expect($("mocked_video_collection").innerHTML).to_not(match, 'new_instance');
                       var newInstance = Video.create({
                           id: '2',
                           words: 'new_instance'
                       })
                       expect($("mocked_video_collection").innerHTML).to(match, MBX.JsTemplate.render('video2', newInstance));
                   });
                   
                   it("should allow you to not remove elements", function () {
                       TH.insertDomMock("mvc/single_video");
                       instance.destroy();
                       expect($("mocked_video")).to_not(be_null)
                   });
                   
               });
               
           });
           
           
           
        });
    });
});
