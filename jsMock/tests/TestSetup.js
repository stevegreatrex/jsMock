module("Setup test");

test("method name is set", function () {
    var setup = new jsMock.Setup("member");
    equal("member", setup.member, "Member should have been set");
});

test("call count initially 0", function () {
    var setup = new jsMock.Setup("member");

    equal(0, setup.calls.length, "call count should initially be 0");
});

test("called increments call count", function () {
    var setup = new jsMock.Setup("member");

    setup.called();

    equal(1, setup.calls.length, "calls should have been updated");
});

test("called adds call with empty arguments", function () {
    var setup = new jsMock.Setup("member");

    setup.called();

    var call = setup.calls[0];
    deepEqual([], call.arguments, "Arguments should have been set on the call");
});


test("called adds call with populated arguments", function () {
    var setup = new jsMock.Setup("member");

    var four = { name: "four" };
    var five = function () { };

    setup.called([1, "2", [3], four, five]);

    var call = setup.calls[0];
    deepEqual([1, "2", [3], four, five], call.arguments, "Arguments should have been set on the call");
});

test("with method returns setup", function () {
    var setup = new jsMock.Setup("member");
    var fromWith = setup.with();
    equal(fromWith, setup, "The with method should return the original setup object");
});

test("called acts normally when matching with is called", function() {
    var setup = new jsMock.Setup("member")
    
        //expect specific paramemers
        .with("one", 2, false);

    //notify the setup that it was called with those parameters
    setup.called(["one", 2, false]);

    //check that the call was added normally
    equal(1, setup.calls.length, "The call should have been added");
});

test("called throws exception when non-matching with is called", function() {
    var setup = new jsMock.Setup("member")
    
        //expect specific paramemers
        .with("1", 2, false);

    raises(function() {
        setup.called([]);
    }, "Invalid parameters");

    raises(function() {
        setup.called([1, 2, false]);
    }, "Invalid parameters");

    raises(function() {
        setup.called(["1", "2", false]);
    }, "Invalid parameters");

    raises(function() {
        setup.called(["1", 2, "false"]);
    }, "Invalid parameters");
});
