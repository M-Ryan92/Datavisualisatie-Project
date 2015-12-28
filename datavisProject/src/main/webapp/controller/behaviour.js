var behaviour = {};
var p;
behaviour.get = function (d) {
    p = d;
    if (d.properties.postcode !== undefined)
    {
        return polygon;

    }
    if (d.properties.point !== undefined)
    {
        return point;
    }
};

var polygon = {};

polygon.tooltipDiv;

polygon.id = function () {
    return p.properties.postcode;
};

polygon.fill = function (func, usage) {
    var col = p.properties.fill;
    if (typeof usage !== "undefined" && usage.hasOwnProperty(p.properties.postcode)) {
        col = func(usage[p.properties.postcode]);
    }
    return col;
};

polygon.strokeWidth = function () {
    return p.properties['stroke-width'];
};

polygon.stroke = function () {
    return p.properties.stroke;
};

polygon.radius = function () {
};


polygon.mouseover = function () {
    var element = d3.selectAll("path[id='" + p.properties.postcode + "']");
    element.style("opacity", .8);
    element.attr("stroke-width", 0);

    d3.select('.map').selectAll('.tooltip').remove();
    polygon.tooltipDiv = d3.select('.map').append('div').attr('class', 'tooltip');
    var absoluteMousePos = d3.mouse(d3.select('.map').node());
    polygon.tooltipDiv.style('left', (absoluteMousePos[0] + 30) + 'px')
            .style('top', (absoluteMousePos[1] - 30) + 'px');
    var tooltipText = p.properties.postcode;
    polygon.tooltipDiv.html(tooltipText);
};

polygon.mousemove = function () {
    var absoluteMousePos = d3.mouse(d3.select('.map').node());
                polygon.tooltipDiv.style('left', (absoluteMousePos[0] + 30) + 'px')
                            .style('top', (absoluteMousePos[1] - 30) + 'px');
                var tooltipText = p.properties.postcode;
                polygon.tooltipDiv.html(tooltipText);
};

polygon.mouseout = function () {
    var element = d3.selectAll("path");
    element.style("opacity", 1);
    element.attr("stroke-width", p.properties['stroke-width']);
    polygon.tooltipDiv.remove();

};


var point = {};

point.id = function () {
    return "p" + p.properties.point;
};

point.fill = function (func, usage) {
    return p.properties.fill;
};

point.strokeWidth = function () {
};

point.stroke = function () {
};

point.radius = function (d) {
    var bbox = d;
    var box = p.geometry.coordinates;
    console.log(box);
    return "translate("+(-(box[0]))+" "+ "0" + ") scale(.5) translate("+((bbox[0]/2))+" "+ (bbox[1]/2)+")";
};

point.mouseover = function () {
};

point.mousemove = function () {
};

point.mouseout = function () {
};