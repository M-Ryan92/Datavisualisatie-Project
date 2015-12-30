var line;

line = function (s, e) {
    var feature = {};
    feature.type = "Feature";
    feature.geometry = {};
    feature.geometry.type = "LineString";
    feature.geometry.coordinates = [];
    feature.geometry.coordinates[0] = [s[0],s[1]];
    feature.geometry.coordinates[1] = [e[0],e[1]];
    
    return feature;
};