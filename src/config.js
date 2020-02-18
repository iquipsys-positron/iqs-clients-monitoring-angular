(function () {

    var config = {
        "session": {
            "serverUrl": "/",
            "authorizedState": "app.map",
            "unautorizedState": "landing"
        }
    };

    angular
        .module('iqsConfig', [])
        .constant('SHELL_RUNTIME_CONFIG', config);
})();
