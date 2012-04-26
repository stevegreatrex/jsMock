(function (jsMock) {
    jsMock.Setup = function (member) {
        var _self = this,

        //store all calls
            _calls = [],

        //store expected parameters
            _expectedParameters = null,

        //notify this setup that it has been called
            _called = function (arguments) {
                if (!_areParametersValid(arguments)) throw "Invalid parameters";
                _calls.push({
                    arguments: arguments || []
                });
            },

        //set expected parameters
            _with = function () {
                _expectedParameters = [];
                for (var i = 0; i < arguments.length; i++) {
                    _expectedParameters.push(arguments[i]);
                }
                return _self;
            },
        //check matching arguments against those specified
            _areParametersValid = function(params) {
                //if nothing has been specified, we're fine
                if (_expectedParameters === null) return true;

                //same number of parameters?
                if (_expectedParameters.length != params.length) return false;

                //each parameter matches?
                for (var i = 0; i < params.length; i++) {
                    if (_expectedParameters[i] !== params[i]) return false;
                }

                return true;
            };

        //public members
        this.member = member;
        this.calls = _calls;
        this.called = _called;
        this.with = _with;
    };
})(jsMock);