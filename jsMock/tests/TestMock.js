module("Mock");

test("setup creates a valid method", function () {
    var mock = new jsMock.Mock();

    //setup a member
    var setup = mock.setup("member");

    notEqual(undefined, setup.times, "The return type should be a setup (checking times property)");
    equal("function", typeof mock.member, "A member should have been created");
});

test("setup method registers calls", function () {
    var mock = new jsMock.Mock();

    //setup a member
    var setup = mock.setup("member");

    mock.member();

    equal(1, setup.calls.length, "The call should have been registered");
});

test("setup method returns configured return value", function () {
    var mock = new jsMock.Mock();

    //setup a member
    var setup = mock.setup("member").returns("a value");

    //check the method result
    var result = mock.member();
    equal("a value", result, "The returned result should have been what was set up on the mock");
});

test("setup method registers correct method parameters", function () {
    var mock = new jsMock.Mock();

    //setup a member
    var setup = mock.setup("member");

    //check the method result
    var result = mock.member(1, "two", true);
    deepEqual([1, "two", true], setup.calls[0].arguments, "Method arguments should have been passed through");
});

test("verify verifies all setups", function () {
    var mock = new jsMock.Mock();

    mock.setup("member1").times.once();
    mock.setup("member2").times.never();

    //initially member1 fails, member2 passes
    raises(function () { mock.verify(); });

    //make member1 pass
    mock.member1();
    mock.verify(); //no exceptions

    //now make member2 fail
    mock.member2();
    raises(function () { mock.verify(); });

    //now make both members fail
    mock.member1();
    raises(function () { mock.verify(); });
});