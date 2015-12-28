var behaviour = {};

behaviour.get = function (d) {

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