"use strict";
var moment = require('moment');
var RIPPLE_BASE_TIME = 946684800;

var rippleTimeToMoment = exports.rippleTimeToMoment = function(epoch){
    return moment.unix(RIPPLE_BASE_TIME).add(epoch, 'seconds')
}

var momentToRippleTime = exports.momentToRippleTime = function(m){
    return m.clone().subtract(RIPPLE_BASE_TIME, 'seconds').unix()
}

var unixTimeToRippleTime = exports.unixTimeToRippleTime = function(unixtime){
    return moment.unix(unixtime).subtract(RIPPLE_BASE_TIME, 'seconds').unix()
}

var now = exports.now = function(){
    return moment();
}

