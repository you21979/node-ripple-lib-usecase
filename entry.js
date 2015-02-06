var entry = {
    rippleUsecase : require('./index'),
};

Object.keys(entry).forEach(function(key){
    global[key] = entry[key];
})

