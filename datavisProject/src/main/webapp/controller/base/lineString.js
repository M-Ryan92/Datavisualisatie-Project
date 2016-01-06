var lineString = {};

lineString.makeFeature = function (s, e, c, id) {
    var feature = {};
    feature.type = "Feature";
    feature.properties = {};
    feature.properties.color = c;

    if (id !== undefined) {
        feature.properties.lineid = id;
    }

    feature.geometry = {};
    feature.geometry.type = "LineString";
    feature.geometry.coordinates = [];
    feature.geometry.coordinates[0] = [s[0], s[1]];
    feature.geometry.coordinates[1] = [e[0], e[1]];

    return feature;
};

lineString.p;
lineString.id = function () {
    return lineString.p.properties.lineid;
};

lineString.fill = function (func, usage) {
};

lineString.strokeWidth = function () {
    return 1;
};

lineString.stroke = function () {
    return lineString.p.properties.color;
};

lineString.radius = function () {
};

lineString.mouseover = function () {
};

lineString.mousemove = function () {
};

lineString.mouseout = function () {
};