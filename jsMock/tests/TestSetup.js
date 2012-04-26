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