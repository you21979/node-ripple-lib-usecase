var rp = require('ripple-lib-promise');
var Promise = rp.Promise;
var orderBook = rp.orderbook.orderBook;

var util = require('./util');
var offer = require('./offer');

var convertOrderBook = function(pairfull){
    var w = pairfull.split('_');
    var pays = w[0].split('.');
    var gets = w[1].split('.');
    if(pays.length === 1){
        pays.push('');
    }
    if(gets.length === 1){
        gets.push('');
    }
    return {
        currency_pays : pays[0],
        issuer_pays : pays[1],
        currency_gets : gets[0],
        issuer_gets : gets[1],
    }
}

var detailOrderBook = module.exports = function(remote, pairfull){
    var w = pairfull.split('_');
    return Promise.all([
        orderBook(remote, convertOrderBook(pairfull)),
        orderBook(remote, convertOrderBook(w.reverse().join('_')))
    ]).
    spread(function(bids, asks){
        var mapAmount = function(base, counter){
            return function(v){
                var gets, pays;
                if(base.substr(0, 3) === 'XRP'){
                    gets = util.XRPtoNumber(v.taker_gets_funded);
                }else{
                    gets = parseFloat(v.taker_gets_funded);
                }
                if(counter.substr(0, 3) === 'XRP'){
                    pays = util.XRPtoNumber(v.taker_pays_funded);
                }else{
                    pays = parseFloat(v.taker_pays_funded);
                }
                return {
                    gets : gets,
                    pays : pays,
                    quality : pays/gets,
                    other : v,
                }
            }
        }
        return {
            bids:bids.map(mapAmount(w[0], w[1])),
            asks:asks.map(mapAmount(w[1], w[0])),
        }
    })
}

