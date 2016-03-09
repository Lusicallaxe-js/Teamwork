var app = app || {};

app.UserRequester = (function () {
    // TODO: var requestUrl
    function UserRequester() {
        this.serviceUrl = app.Requester.baseUrl + 'user/' + app.Requester.appId;
    }

    UserRequester.prototype.signUp = function (username, password, email) {
        var requestUrl = this.serviceUrl,
            data = {
                username: username,
                password: password,
                email: email
            };
        app.Requester.makeRequest('POST', requestUrl, data).then(function (success) {
            sessionStorage['sessionAuth'] = success._kmd.authtoken;
            sessionStorage['userId'] = success._id;
        }, function (error) {
            console.error(error);
        }).done()
    };

    UserRequester.prototype.login = function (username, password) {
        var requestUrl = this.serviceUrl + '/login',
            data = {
                username: username,
                password: password
            };

        app.Requester.makeRequest('POST', requestUrl, data).then(function (success) {
            sessionStorage['sessionAuth'] = success._kmd.authtoken;
            sessionStorage['userId'] = success._id;
        }, function (error) {
            console.error(error);
        }).done()
    };

    UserRequester.prototype.logout = function () {
        var requestUrl = this.serviceUrl + '/_logout';
        app.Requester.makeRequest('POST', requestUrl, {}, true).then(function (success) {
            console.log('Logout successfully');
            console.log(success);
        }, function (error) {
            console.error(error);
        }).done();
    };

    UserRequester.prototype.getInfo = function () {
        var requestUrl = this.serviceUrl + '/_me';

        app.Requester.makeRequest('GET', requestUrl, null, true).then(function (success) {
            console.log(success);
        }, function (error) {
            console.error(error);
        }).done();
    };

    return UserRequester;
}());