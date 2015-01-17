var ripple = require('ripple-lib-promise').ripple;
var Amount = ripple.Amount;
var Transaction = ripple.Transaction;

var XRP_UNIT_RIPPLE = Amount.bi_xns_unit.intValue() * 1.0;
var XRP_UNIT_HUMAN = 1 / Amount.bi_xns_unit.intValue();

var NumbertoXRP = exports.NumbertoXRP= function(num){
    return Math.floor(num * XRP_UNIT_RIPPLE).toString();
}

var XRPtoNumber = exports.XRPtoNumber = function(str){
    return parseFloat(str) * XRP_UNIT_HUMAN;
}

var valueToRipple = exports.valueToRipple = function(name, value){
    var w = name.split('.');
    return (w[0] === 'XRP') ? NumbertoXRP(value) :
                              {currency:w[0], issuer:w[1], value:value.toString()};
}

var valueFromRipple = exports.valueFromRipple = function(data){
    if(data instanceof Object){
        return {
            currency : data.currency,
            issuer : data.issuer,
            value : parseFloat(data.value),
        }
    }else{
        return {
            currency : "XRP",
            issuer : "",
            value : XRPtoNumber(data),
        }
    }
}

var adjustValueFloor = exports.adjustValueFloor = function(value, digit){
    var n = Math.pow(10, digit);
    return Math.floor(value * n) / n;
}

var adjustValueCeil = exports.adjustValueCeil = function(value, digit){
    var n = Math.pow(10, digit);
    return Math.ceil(value * n) / n;
}

var LOG10 = Math.log(10.0);
var numberOfDigits = exports.numberOfDigits = function(value){
    return Math.floor(Math.log(value) / LOG10) + 1;
}

