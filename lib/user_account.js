var rp = require('ripple-lib-promise');
var Promise = rp.Promise;

var watchAccount = require('./watch_account');

var UserAccount = module.exports = function(remote, account){
    this.remote = remote;
    this.account = account;
}

UserAccount.prototype.assets = function(){
    return watchAccount.assets(this.remote, this.account);
}

