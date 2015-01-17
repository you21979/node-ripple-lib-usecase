var rp = require('ripple-lib-promise');
var Promise = rp.Promise;

var util = require('./util');
var offer = require('./offer');

var getCurrencyName = function(v, delimiter){
    return v.currency === 'XRP' ?   v.currency :
                                    [v.currency, v.issuer].join(delimiter)
}
var thenAccountLineNext = function(remote, list, limit){
    return function(res){
        list.push(res);
        var ledger = res.ledger_current_index || res.ledger_index;
        if( res.marker === undefined ){
            return list.reduce(function(r,v){
                return r.concat(v.lines)
            }, []);
        }
        return rp.req.accountLines( remote, res.account, {
            limit:limit,
            ledger:ledger,
            marker:res.marker,
        }).then(thenAccountLineNext(remote, list, limit));
    }
}

var activeOrders = exports.activeOrders = function(remote, address){
    return rp.req.accountOffers(remote, address).then(function(res){
        return res.offers.map(function(order){
            var type = offer.isOfferType(order.flags);
            var pays = util.valueFromRipple(order.taker_pays);
            var gets = util.valueFromRipple(order.taker_gets);
            var base = (type === 'BID') ? pays : gets;
            var counter = (type === 'BID') ? gets : pays;
            return {
                id : order.seq,
                type : offer.isOfferType(order.flags),
                amount : {
                    base : base.value,
                    counter : counter.value,
                },
                price : counter.value / base.value,
                pair : [base.currency, counter.currency].join('_'),
                pairfull : [getCurrencyName(base, '.'), getCurrencyName(counter, '.')].join('_'),
            }
        })
    })
}

var fullAccountLines = exports.fullAccountLines = function(remote, address){
    var limit = 1024;
    return rp.req.accountLines( remote, address, { limit : limit } ).
        then(thenAccountLineNext(remote, [], limit))
}

var assets = exports.assets = function(remote, address){
    return Promise.all([
        fullAccountLines(remote, address),
        rp.req.accountBalance(remote, address)
    ]).spread(function( lines, balance ){
        var w = [];
        lines.forEach(function(line){
            w.push({
                name : line.currency,
                account : line.account,
                value : parseFloat(line.balance),
            })
        })
        w.push({
            name : 'XRP',
            account : '',
            value : util.XRPtoNumber(balance.node.Balance),
        });
        return w;
    })
}


