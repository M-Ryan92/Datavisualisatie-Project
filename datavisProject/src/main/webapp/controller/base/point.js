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
    var psl = d3.select("path#p" + point.p.properties.point)[0][0];
    psl = getSegList(psl.getAttribute("d"))[0];

    return "translate(" + (psl.x) + "," + (psl.y) + ") scale(" + .2 + ") translate(" + (-psl.x) + "," + (-psl.y) + ")";
};

point.mouseover = function () {
//    var element = d3.selectAll("path[id='" + point.p.properties.point + "']");
//    element.style("opacity", .8);
//    element.attr("stroke-width", 0);

    d3.select('.map').selectAll('.tooltip').remove();
    polygon.tooltipDiv = d3.select('.map').append('div').attr('class', 'tooltip');
    var absoluteMousePos = d3.mouse(d3.select('.map').node());
    polygon.tooltipDiv.style('left', (absoluteMousePos[0] + 30) + 'px')
            .style('top', (absoluteMousePos[1] - 30) + 'px');
    var tooltipText = point.p.properties.point;
    polygon.tooltipDiv.html(tooltipText);
};

point.mousemove = function () {
};

point.mouseout = function () {
        var element = d3.selectAll("path[id='" + point.p.properties.point + "']");
//    element.style("opacity", 1);
//    element.attr("stroke-width", polygon.p.properties['stroke-width']);
    polygon.tooltipDiv.remove();
};

var getSegList = function (d) {
    var segment = d.split('');
    var seg = [];
    var coord = "x";
    segment.forEach(function (c) {
        if (c.match(/[a-zA-Z]/)) {
            seg.push({});
            seg[seg.length - 1]['type'] = c;
            coord = "x";
        } else {
            if (c.match(',')) {
                coord = "y";
            }
            if (seg[seg.length - 1][coord] === undefined) {
                seg[seg.length - 1][coord] = "";
            }
            if (!c.match(',')) {
                seg[seg.length - 1][coord] += c;
            }

        }

    });
    return seg;
};