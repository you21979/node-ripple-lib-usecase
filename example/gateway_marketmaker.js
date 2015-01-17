var rp = require('ripple-lib-promise');
var GatewayAccount = require('..').GatewayAccount;
rp.createConnect().then(function(remote){
    var g = new GatewayAccount(remote, 'tokyojpy','r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN', 'JPY');
    return g.showMarketMakers('XRP_JPY.r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN').then(function(res){
        console.log(res.bids.slice(0,5))
        console.log(res.asks.slice(0,5))
        return remote;
    }).catch(function(e){
        console.log(e)
        return remote;
    });
}).then(function(remote){
    remote.disconnect();
    process.exit(0);
})
