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
};

point.mousemove = function () {
};

point.mouseout = function () {
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