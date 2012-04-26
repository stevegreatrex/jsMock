(function (jsMock) {
    jsMock.Setup = function (member) {
        var _self = this,
            _calls = [],
            _called = function (arguments) {
                _calls.push({
                    arguments: arguments || []
                });
            };

        //public members
        this.member = member;
        this.calls  = _calls;
        this.called = _called;
    };
})(jsMock);