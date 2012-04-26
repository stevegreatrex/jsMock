module("Setup");

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

test("called accepts 'anything' constant", function() {
    var setup = new jsMock.Setup("member")
    
        //expect specific paramemers with one 'anything' constant
        .with("1", jsMock.constants.anything, false);

    var func = function(){};
    setup.called(["1", 2, false]);
    setup.called(["1", null, false]);
    setup.called(["1","2", false]);
    setup.called(["1", func, false]);

    equal(4, setup.calls.length, "Alll 4 calls should have been valid");
    equal(2, setup.calls[0].arguments[1], "The original argument should have been used");
    equal(null, setup.calls[1].arguments[1], "The original argument should have been used");
    equal("2", setup.calls[2].arguments[1], "The original argument should have been used");
    equal(func, setup.calls[3].arguments[1], "The original argument should have been used");

});

test("matches correctly checks parameter lists", function() {
    var setup = new jsMock.Setup("member")
    
        //expect specific paramemers
        .with("1", 2, false);

    equal(false, setup.matches([]), "Parameters should not match");
    equal(false, setup.matches([1, 2, false]), "Parameters should not match");
    equal(false, setup.matches(["1", "2", false]), "Parameters should not match");
    equal(false, setup.matches(["1", 2, "false"]), "Parameters should not match");
    equal(true, setup.matches(["1", 2, false]), "Parameters should match");
});

test("matches accepts 'anything' constant", function() {
    var setup = new jsMock.Setup("member")
    
        //expect specific paramemers with one 'anything' constant
        .with("1", jsMock.constants.anything, false);

    var func = function(){};
    equal(true, setup.matches(["1", 2, false]), "Should have matched");
    equal(true, setup.matches(["1", null, false]), "Should have matched");
    equal(true, setup.matches(["1","2", false]), "Should have matched");
    equal(true, setup.matches(["1", func, false]), "Should have matched");
});

test("callbacks are all called", function() {
    var setup = new jsMock.Setup("member"),
        callback1CallCount = 0,
        callback2CallCount = 0;

    //setup 2 callbacks
    setup.callback(function() {
        callback1CallCount++;
    });
    setup.callback(function() {
        callback2CallCount++;
    });

    //register a call
    setup.called([]);

    //check both callbacks were invoked
    equal(1, callback1CallCount, "Callback should have been invoked");
    equal(1, callback2CallCount, "Callback should have been invoked");

    //register another call
    setup.called([]);

    //check both callbacks were invoked again
    equal(2, callback1CallCount, "Callback should have been invoked");
    equal(2, callback2CallCount, "Callback should have been invoked");
});

test("callbacks get parameters passed in", function() {
     var setup = new jsMock.Setup("member"),
        callbackParam1 = null,
        callbackParam2 = null,
        callbackThis = null;

    //setup a callback that takes parameters
    setup.callback(function(one, two) {
        callbackParam1 = one;
        callbackParam2 = two;
        callbackThis = this;
    });

    setup.called(["one", 2]);

    //check that the parameters were set
    equal("one", callbackParam1, "Callback parameters should have been set");
    equal(2, callbackParam2, "Callback parameters should have been set");
    equal(setup, callbackThis, "The value of 'this' should be the setup within the callback");
});

test("times.exactly", function() {
    var setup = new jsMock.Setup("member");
    var returnedSetup = setup.times.exactly(2);
    equal(setup, returnedSetup, "exactly should return the setup");

    //no calls so far, so should fail
    raises(function() { setup.verify(); }, "Expected 2 calls but had 0");

    //make a call
    setup.called();
    raises(function() { setup.verify(); }, "Expected 2 calls but had 1");

    //make another call
    setup.called();
    setup.verify(); //don't expect an exception

    //make 1 call too many
    setup.called();
    raises(function() { setup.verify(); }, "Expected 2 calls but had 3");
});

test("times.once", function() {
    var setup = new jsMock.Setup("member")
    var returnedSetup = setup.times.once();
    equal(setup, returnedSetup, "once should return the setup");

    //no calls so far, so should fail
    raises(function() { setup.verify(); }, "Expected 1 calls but had 0");

    //make a call
    setup.called();
    setup.verify(); //don't expect an exceptio
    
    //make 1 call too many
    setup.called();
    raises(function() { setup.verify(); }, "Expected 1 calls but had 2");
});

test("times.atLeast", function() {
var setup = new jsMock.Setup("member")
    var returnedSetup = setup.times.atLeast(2);
    equal(setup, returnedSetup, "atLeast should return the setup");

    //no calls so far, so should fail
    raises(function() { setup.verify(); }, "Expected 2- calls but had 0");

    //make a call
    setup.called();
    raises(function() { setup.verify(); }, "Expected 2- calls but had 1");

    //make a call
    setup.called();
    setup.verify(); //don't expect an exception
    
    //make a call
    setup.called();
    setup.verify(); //don't expect an exception
});

test("times.noMoreThan", function() {
    var setup = new jsMock.Setup("member")
    var returnedSetup = setup.times.noMoreThan(2);
    equal(setup, returnedSetup, "noMoreThan should return the setup");

    //no calls so far, so should pass
    setup.verify();

    //make a call
    setup.called();
    setup.verify(); //should still pass

    //make a call
    setup.called();
    setup.verify(); //should still pass

    //make a call
    setup.called();
    raises(function() { setup.verify(); }, "Expected 0-2 calls but had 3");

    //make a call
    setup.called();
    raises(function() { setup.verify(); }, "Expected 0-2 calls but had 4");
});

test("times.never", function() {
    var setup = new jsMock.Setup("member")
    var returnedSetup = setup.times.never();
    equal(setup, returnedSetup, "never should return the setup");

    //no calls so far, so should pass
    setup.verify();

    //make a call
    setup.called();
    raises(function() { setup.verify(); }, "Expected 0 calls but had 1");

     //make a call
    setup.called();
    raises(function() { setup.verify(); }, "Expected 0 calls but had 2");
});


test("returns() sets return type", function() {
    var setup = new jsMock.Setup("member")
    var fromReturns = setup.returns("return value");
    equal(setup, fromReturns, "returns should return the setup");

    equal("return value", setup.returnValue, "The returnValue property should have been set");
});