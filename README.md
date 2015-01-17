# node-ripple-lib-usecase

## usecase of gateway watch


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

