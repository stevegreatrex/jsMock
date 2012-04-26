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


test("setup with same signature overwrites", function () {
    var mock = new jsMock.Mock(),
        resultWithParams,
        resultWithoutParams;

    //setup two calls that return 'first result'
    mock.setup("member").returns("first result");
    mock.setup("memberWithParameters").with(jsMock.constants.anything).returns("first result");

    //overwrite both calls
    mock.setup("member").returns("second result");
    mock.setup("memberWithParameters").with(jsMock.constants.anything).returns("second result");

    //make the calls
    resultWithoutParams = mock.member();
    resultWithParams = mock.memberWithParameters(null);

    //check that both returned the more recent result
    equal("second result", resultWithoutParams, "The more recent setup should overwrite the earlier one");
    equal("second result", resultWithParams, "The more recent setup should overwrite the earlier one");
});

test("setup supports multiple methods with different signatures", function() {
     var mock = new jsMock.Mock();

     var one = mock.setup("member").returns("one");
     var two = mock.setup("member").with(jsMock.constants.anything).returns("two");
     var three = mock.setup("member").with("specific value").returns("three");
     var four = mock.setup("member").with().returns("four");
     var five = mock.setup("other");

     equal(mock.member("specific value"), "three", "Can match most specific value so should use that");
     equal(mock.member(null), "two", "Can't match 'specific value' but can match anything");
     equal(mock.member(), "four", "Can match the parameterless version");
     equal(mock.member("this", "doesnt", "match"), "one", "Can only match the catch-all version");

     equal(three.calls.length, 1, "A single call match the most specific version");
     equal(two.calls.length, 2, "Both the first and second calls match the second setup (as 'specific value' also matches against 'anything'");
     equal(one.calls.length, 4, "All calls should match the one without parameters specified");
     equal(four.calls.length, 1, "A single call matches the parameterless setup");
     equal(five.calls.length, 0, "No calls matched the other member");
});

test("setup throws when no matching signature", function() {
    var mock = new jsMock.Mock();

    mock.setup("member").with("one").returns("one");

    raises(function() { mock.member(); });
    raises(function() { mock.member("two"); });
});

test("setup does not throw when no matching signature but not strict", function() {
    var mock = new jsMock.Mock();

    mock.setup("member").with("one").returns("one");

    mock.strict = false;

    mock.member();
    mock.member("two");
});