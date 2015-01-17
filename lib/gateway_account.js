var rp = require('ripple-lib-promise');
var Promise = rp.Promise;

var watchAccount = require('./watch_account');
var tradeOrderBook = require('./trade_orderbook');
var detailOrderBook = require('./detail_orderbook');
var util = require('./util');

var GatewayAccount = module.exports = function(remote, name, issuer, issuance){
    this.remote = remote;
    this.name = name;
    this.issuer = issuer;
    this.issuance = (issuance instanceof Array) ? issuance : [issuance];
}

GatewayAccount.prototype.tradeOrderbook = function(pairfull, range){
    if(!range) range = 4;
    return tradeOrderBook(this.remote, pairfull).then(function(book){
        return book.normalize(range - util.numberOfDigits(book.bestAsk()))
    })
}
GatewayAccount.prototype.detailOrderbook = function(pairfull){
    return detailOrderBook(this.remote, pairfull)
}

GatewayAccount.prototype.debt = function(){
    var self = this;
    return watchAccount.fullAccountLines(this.remote, this.issuer).then(function(assets){
        return assets.map(function(line){
            return {
                name : line.currency,
                account : line.account,
                value : parseFloat(line.balance),
            }
        }).filter(function(asset){
            return asset.value <= 0
                    && (self.issuance.filter(function(v){ return v === asset.name }).length > 0)
        }).reduce(function(r, v){
            r.holders.push(v);
            if(!(v.name in r.debt)){
                r.debt[v.name] = 0;
            }
            r.debt[v.name] += v.value;
            return r;
        }, { holders:[], debt:{} });
    })
};

GatewayAccount.prototype.bestAsk = function(pairfull){
    return this.tradeOrderbook(pairfull).then(function(book){
        return book.bestAsk();
    })
};

GatewayAccount.prototype.showMarketMakers = function(pairfull){
    return this.detailOrderbook(pairfull).then(function(res){
        var reducer = function(r,v){
            if(!(v.account in r)){
                r[v.account] = 0;
            }
            r[v.account] += v.count;
            return r;
        }
        var bidmaker = res.bids.map(function(v){return {account:v.other.Account, count:1}}).reduce(reducer,{});
        var askmaker = res.asks.map(function(v){return {account:v.other.Account, count:1}}).reduce(reducer,{});
        var bidmakers = Object.keys(bidmaker).map(function(key){ return {account:key, count:bidmaker[key]} })
        var askmakers = Object.keys(askmaker).map(function(key){ return {account:key, count:askmaker[key]} })
        var sort = function(a,b){
            if(a.count > b.count) return -1;
            else if(a.count < b.count) return 1;
            else return 0;
        }
        return {
            bids : bidmakers.sort(sort),
            asks : askmakers.sort(sort),
        }
    })
};

