var polygon = {};
polygon.p;
polygon.tooltipDiv;

polygon.id = function () {
    return polygon.p.properties.postcode;
    
};

polygon.fill = function (func, usage) {
    var col = polygon.p.properties.fill;
    if (typeof usage !== "undefined" && usage.hasOwnProperty(polygon.p.properties.postcode)) {
        col = func(usage[polygon.p.properties.postcode]);
    }
    return col;
};

polygon.strokeWidth = function () {
    return polygon.p.properties['stroke-width'];
};

polygon.stroke = function () {
    return polygon.p.properties.stroke;
};

polygon.radius = function () {
};


polygon.mouseover = function () {
    var element = d3.selectAll("path[id='" + polygon.p.properties.postcode + "']");
    element.style("opacity", .8);
    element.attr("stroke-width", 0);

    d3.select('.map').selectAll('.tooltip').remove();
    polygon.tooltipDiv = d3.select('.map').append('div').attr('class', 'tooltip');
    var absoluteMousePos = d3.mouse(d3.select('.map').node());
    polygon.tooltipDiv.style('left', (absoluteMousePos[0] + 30) + 'px')
            .style('top', (absoluteMousePos[1] - 30) + 'px');
    var tooltipText = polygon.p.properties.postcode;
    polygon.tooltipDiv.html(tooltipText);
};

polygon.mousemove = function () {
    var absoluteMousePos = d3.mouse(d3.select('.map').node());
                polygon.tooltipDiv.style('left', (absoluteMousePos[0] + 30) + 'px')
                            .style('top', (absoluteMousePos[1] - 30) + 'px');
                var tooltipText = polygon.p.properties.postcode;
                polygon.tooltipDiv.html(tooltipText);
};

polygon.mouseout = function () {
    var element = d3.selectAll("path[id='" + polygon.p.properties.postcode + "']");
    element.style("opacity", 1);
    element.attr("stroke-width", polygon.p.properties['stroke-width']);
    polygon.tooltipDiv.remove();

};