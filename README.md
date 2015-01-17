# ripple-usecase

install
```


```


## usecase of gateway watch

```
var rp = require('ripple-lib-promise');
var GatewayAccount = require('ripple-usecase').GatewayAccount;
rp.createConnect().then(function(remote){
    var g = new GatewayAccount(remote, 'tokyojpy', 'r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN', 'JPY');
    g.debt().then(function(res){
        console.log('gateway trust count %d', res.holders.length);
        Object.keys(res.debt).forEach(function(key){
	    console.log('gateway balance %s:%d', key, res.debt[key]);
        });
    });
})
```

## usecase of payment


## usecase of trade

```
var rp = require('ripple-lib-promise');
var TradeWallet = require('ripple-usecase').TradeWallet;
rp.createConnect().then(function(remote){
    var w = new TradeWallet(remote, 'your address', 'your secret');
    var pair = 'XRP_JPY.r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN';
    w.orderbook(pair).then(function(book){
        // your trade condition
        var price = 0.1;
        var amount = 100;
        var expire = 3600; // option
        w.buy(pair, price, amount, expire).then(console.log);
    })
})
```

