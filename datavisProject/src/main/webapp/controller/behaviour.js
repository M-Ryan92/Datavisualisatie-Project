var behaviour = {};

behaviour.get = function (d) {

    if (d.geometry.type === "LineString") {
        lineString.p = d;
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
};

lineString.strokeWidth = function () {
    return .8;
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
