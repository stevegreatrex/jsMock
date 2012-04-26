jsMock = {};

(function (jsMock) {
    jsMock.constants = {
        anything: {}
    };

    jsMock.Setup = function (member) {
        var _self = this,

        //store all calls
            _calls = [],
        
        //store all callbacks
            _callbacks = [],

        //store expected parameters
            _expectedParameters = null,

        //store return value
            _returnValue = null,

        //notify this setup that it has been called
            _called = function (arguments) {
                if (!_areParametersValid(arguments)) throw "Invalid parameters";
                _calls.push({
                    arguments: arguments || []
                });

                for (var i = 0; i < _callbacks.length; i++) {
                    _callbacks[i].apply(this, arguments);
                }
            },

        //set expected parameters
            _with = function () {
                _expectedParameters = [];
                for (var i = 0; i < arguments.length; i++)
                    _expectedParameters.push(arguments[i]);
                return _self;
            },
            
        //register a callback
            _callback = function(callback) {
                _callbacks.push(callback);
            },

        //check matching arguments against those specified
            _areParametersValid = function(params) {
                //if nothing has been specified, we're fine
                if (_expectedParameters === null) return true;

                //same number of parameters?
                if (_expectedParameters.length != params.length) return false;

                //each parameter matches?
                for (var i = 0; i < params.length; i++) {
                    if (_expectedParameters[i] !== jsMock.constants.anything &&
                        _expectedParameters[i] !== params[i]) return false;
                }

                return true;
            },
        
        //time recording
            _expectedTimes = { min: 0, max: NaN },
            _times = {
                exactly: function(count) {
                    _expectedTimes.min = _expectedTimes.max = count;
                    return _self;
                },
                once: function() {
                    return _times.exactly(1);
                },
                never: function() {
                    return _times.exactly(0);
                },
                atLeast: function(count) {
                    _expectedTimes.min = count;
                    _expectedTimes.max = NaN;
                    return _self;
                },
                noMoreThan: function(count) {
                    _expectedTimes.min = 0;
                    _expectedTimes.max = count;
                    return _self;
                }
            },
            
         //verify
            _verify = function() {
                if (_calls.length < _expectedTimes.min || _calls.length > _expectedTimes.max) {
                    var expectedCount = _expectedTimes.min;
                    if (_expectedTimes.max != _expectedTimes.min)
                        expectedCount = expectedCount + "-" + (_expectedTimes.max === NaN ? "*" : _expectedTimes.max)
                    throw "Expected " + expectedCount  + " calls to " + member + " but had " + _calls.length;
                }
            },
            
         //set return value
            _returns = function(value) {
                this.returnValue = value;
                return _self;
            };

        //public members
        this.member = member;
        this.calls = _calls;
        this.returnValue = null;

        this.called = _called;
        this.with = _with,
        this.matches = _areParametersValid;
        this.callback = _callback;
        this.times = _times;
        this.verify = _verify;
        this.returns = _returns;
    };

    jsMock.Mock = function() {
        var _self = this,

        //store for setups
            _setups = [],

        //function that creates a function for a mocked member
            _mockMemberFactory = function(setup) {
                return function() {
                    var parameters = [];
                    for (var i = 0; i < arguments.length; i++)
                        parameters.push(arguments[i]);

                    setup.called(parameters);
                    return setup.returnValue;
                };
            },

        //create a setup
            _setup = function(member) {
                var setup = new jsMock.Setup(member)
                _setups.push(setup);
                _self[member] = _mockMemberFactory(setup);
                return setup;
            },
        
        //verify    
            _verify = function() {
                for (var i = 0; i < _setups.length; i++) {
                    _setups[i].verify();
                }
            };

        //public members
        this.setup = _setup;
        this.verify = _verify;
    };
})(jsMock);