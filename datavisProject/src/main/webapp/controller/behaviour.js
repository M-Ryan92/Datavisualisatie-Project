var behaviour = {};

behaviour.get = function (d) {

    if (d.properties === undefined) {

        return lineString;
    }
    ;

    if (d.properties.postcode !== undefined)
    {
        polygon.p = d;
        return polygon;

    }
    if (d.properties.point !== undefined)
    {
        point.p = d;
        return point;
    }
};

var lineString = {};
lineString.p;
lineString.id = function () {

};

lineString.fill = function (func, usage) {
    return "#000";
};

lineString.strokeWidth = function () {
    return .5;
};

lineString.stroke = function () {
    return "blue";
};

lineString.radius = function () {

};

lineString.mouseover = function () {
};

lineString.mousemove = function () {
};

lineString.mouseout = function () {
};