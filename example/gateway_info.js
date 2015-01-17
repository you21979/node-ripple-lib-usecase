var rp = require('ripple-lib-promise');
var GatewayAccount = require('..').GatewayAccount;
rp.createConnect().then(function(remote){
    var g = new GatewayAccount(remote, 'tokyojpy','r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN', 'JPY');
    return g.debt().then(function(res){
        console.log('gateway trust count %d', res.holders.length);
        console.log('gateway holder count %d', res.holders.filter(function(v){return v.value < 0}).length);
        Object.keys(res.debt).forEach(function(key){
            console.log('gateway balance %s:%d', key, res.debt[key]);
        });
        return remote;
    }).catch(function(e){
        console.log(e)
        return remote;
    });
}).then(function(remote){
    remote.disconnect();
    process.exit(0);
})
