var behaviour = {};

behaviour.get = function (d) {

    if (d.geometry.type === "LineString") {
        lineString.p = d;
        return lineString;
    }
    ;

    if (d.geometry.type === "Polygon" && d.properties.postcode !== undefined)
    {
        polygon.p = d;
        return polygon;

    }
    if (d.geometry.type === "Point" && d.properties.point !== undefined)
    {
        point.p = d;
        return point;
    }
};