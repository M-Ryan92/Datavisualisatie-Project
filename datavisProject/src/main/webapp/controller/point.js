var point = {};
point.p;
point.id = function () {
    return "p" + point.p.properties.point;
};

point.fill = function (func, usage) {
    return point.p.properties.fill;
};

point.strokeWidth = function () {
};

point.stroke = function () {
};

point.radius = function () {
    var psl = d3.select("path#p" + point.p.properties.point)[0][0].pathSegList[0];
    return "translate(" + (psl.x) + "," + (psl.y) + ") scale(" + .2 + ") translate(" + (-psl.x) + "," + (-psl.y) + ")";
};

point.mouseover = function () {
};

point.mousemove = function () {
};

point.mouseout = function () {
};