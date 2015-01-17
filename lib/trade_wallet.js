var rp = require('ripple-lib-promise');
var Promise = rp.Promise;
var ripple = rp.ripple;
var tradeOrderBook = require('./trade_orderbook')
var watchAccount = require('./watch_account')
var time = require('./time');
var offer = require('./offer');
var util = require('./util');

var createExpire = function(sec){
    var expiration = time.now();
    expiration.add(sec, 'seconds');
    return expiration.unix() * 1000;
}

var TradeWallet = module.exports = function(remote, address, secret){
    this.remote = remote;
    this.address = address;
    this.secret = secret;
}

TradeWallet.prototype.buy = function(pairfull, price, amount, expire_sec){
    var w = offer.offerCreateBid(pairfull, price, amount);
    var opt = {};
    if(expire_sec){
        opt.expiration = createExpire(expire_sec);
    }
    return rp.tx.offerCreate(this.remote, this.secret, this.address, w.buy, w.sell, w.flags, opt);
}

TradeWallet.prototype.sell = function(pairfull, price, amount, expire_sec){
    var w = offer.offerCreateAsk(pairfull, price, amount);
    var opt = {};
    if(expire_sec){
        opt.expiration = createExpire(expire_sec);
    }
    return rp.tx.offerCreate(this.remote, this.secret, this.address, w.buy, w.sell, w.flags, opt);
}

TradeWallet.prototype.buyIOC = function(pairfull, price, amount){
    var w = offer.offerCreateBid(pairfull, price, amount);
    w.flags = offer.offerFlagAddIOC(w.flags);
    return rp.tx.offerCreate(this.remote, this.secret, this.address, w.buy, w.sell, w.flags);
}

TradeWallet.prototype.sellIOC = function(pairfull, price, amount){
    var w = offer.offerCreateAsk(pairfull, price, amount);
    w.flags = offer.offerFlagAddIOC(w.flags);
    return rp.tx.offerCreate(this.remote, this.secret, this.address, w.buy, w.sell, w.flags);
}

TradeWallet.prototype.buyFOK = function(pairfull, price, amount){
    var w = offer.offerCreateBid(pairfull, price, amount);
    w.flags = offer.offerFlagAddFOK(w.flags);
    return rp.tx.offerCreate(this.remote, this.secret, this.address, w.buy, w.sell, w.flags);
}

TradeWallet.prototype.sellFOK = function(pairfull, price, amount){
    var w = offer.offerCreateAsk(pairfull, price, amount);
    w.flags = offer.offerFlagAddFOK(w.flags);
    return rp.tx.offerCreate(this.remote, this.secret, this.address, w.buy, w.sell, w.flags);
}

TradeWallet.prototype.cancel = function(orderid){
    return rp.tx.offerCancel(this.remote, this.secret, this.address, orderid);
}

TradeWallet.prototype.activeOrders = function(){
    return watchAccount.activeOrders(this.remote, this.address);
}

TradeWallet.prototype.cancelAll = function(){
    var self = this;
// 10くらいづつにする
    return this.activeOrders().then(function(orders){
        return Promise.all(orders.map(function(order){
            return self.cancel(order.id);
        }))
    });
}

TradeWallet.prototype.orderbook = function(pairfull, range){
    if(!range) range = 4;
    return tradeOrderBook(this.remote, pairfull).then(function(book){
        return book.normalize(range - util.numberOfDigits(book.bestAsk()))
    })
}

TradeWallet.prototype.balance = function(){
    return watchAccount.assets(this.remote, this.address);
}

TradeWallet.prototype.deposit = function(){
    return Promise.resolve(this.address);
}

TradeWallet.prototype.withdraw = function(dest_address, amount, currency){
    return rp.tx.payment(this.remote, this.secret, this.address,
                dest_address,
                util.valueToRipple(currency, amount)
            );
}


