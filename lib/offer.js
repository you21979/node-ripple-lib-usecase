"use strict";
var ripple = require('ripple-lib-promise').ripple;
var Transaction = ripple.Transaction;
var Remote = ripple.Remote;
var util = require('./util');

var offerCreateBid = exports.offerCreateBid = function(pairfull, price, amount){
    var w = pairfull.split('_');
    return {
        buy : util.valueToRipple(w[0], amount),
        sell : util.valueToRipple(w[1],  amount * price),
        flags : 0,
    }
}

var offerCreateAsk = exports.offerCreateAsk = function(pairfull, price, amount){
    var w = pairfull.split('_');
    return {
        buy : util.valueToRipple(w[1], amount * price),
        sell : util.valueToRipple(w[0], amount),
        flags : Transaction.flags.OfferCreate.Sell,
    }
}

var offerFlagAddPassive = exports.offerFlagAddPassive = function(flags){
    return flags | Transaction.flags.OfferCreate.Passive;
}
var offerFlagAddIOC = exports.offerFlagAddIOC = function(flags){
    return flags | Transaction.flags.OfferCreate.ImmediateOrCancel;
}
var offerFlagAddFOK = exports.offerFlagAddFOK = function(flags){
    return flags | Transaction.flags.OfferCreate.FillOrKill;
}

var isOfferType = exports.isOfferType = function(flags){
    return (flags & Remote.flags.offer.Sell) ? 'ASK' : 'BID';
}

