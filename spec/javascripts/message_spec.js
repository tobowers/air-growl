Screw.Unit(function() {
    describe('Message', function () {
        it("should be a model with the right name", function () {
            expect(AirGrowl.Message.modelName).to(equal, "Message");
        });
    });
});
