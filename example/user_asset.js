var rp = require('ripple-lib-promise');
var UserAccount = require('..').UserAccount;

var opt = process.argv.slice(2)
if(opt.length <= 0){
    console.log('please account input');
    process.exit(-1);
}
var account = opt.shift()

rp.createConnect().then(function(remote){
    var u = new UserAccount(remote, account);
    return u.assets().then(function(res){
        res.forEach(function(v){
            var l = [v.name];
            if(v.account !== ''){
                l.push(v.account);
            }
            console.log("%s,%d", l.join('.'), v.value)
        })
        return remote;
    }).catch(function(e){
        console.log(e)
        return remote;
    });
}).then(function(remote){
    remote.disconnect();
    process.exit(0);
})
