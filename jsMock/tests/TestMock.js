module("Mock");

test("setup creates a valid method", function () {
    var mock = new jsMock.Mock();

    //setup a member
    var setup = mock.setup("member");

    notEqual(undefined, setup.times, "The return type should be a setup (checking times property)");
    equal("function", typeof mock.member, "A member should have been created");
});