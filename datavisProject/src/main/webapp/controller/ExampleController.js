app.registerCtrl('ExampleController', function ($scope, $http) {

    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 300;
    this.scale = 6000;

    this.draw = function () {
        var projection = d3.geo.mercator()
                .scale(this.scale)
                .translate([width / 2, height / 2]);

        d3.select("svg").remove();
        var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height);

        var path = d3.geo.path()
                .projection(projection);

        var m0, o0;

        var drag = d3.behavior.drag()
                .on("dragstart", function () {
                    // Adapted from http://mbostock.github.io/d3/talk/20111018/azimuthal.html and updated for d3 v3
                    var proj = projection.rotate();
                    m0 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
                    o0 = [-proj[0], -proj[1]];
                })
                .on("drag", function () {
                    if (m0) {
                        var m1 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY],
                                o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
                        projection.rotate([-o1[0], -o1[1]]);
                    }

                    // Update the map
                    path = d3.geo.path().projection(projection);
                    d3.selectAll("path").attr("d", path);
                });

        var g = svg.append("g");
        d3.json("map.json", function (error, nld) {
            nld.features.forEach(function (feature) {
                feature.geometry.coordinates.forEach(function (coords) {
                    coords.reverse();
                });
            });
            projection.center([(nld.bbox[0] + nld.bbox[2]) / 2, (nld.bbox[1] + nld.bbox[3]) / 2]);
            g.selectAll("path")
                    .data(nld.features)
                    .enter()
                    .append("path")
                    .attr("class", "boundary")
                    .attr("id", function (d) {
                        return d.properties.postcode;
                    })
                    .attr("fill", function (d) {
                        return d.properties.fill;
                    })
                    .attr("stroke-size", function (d) {
                        return d.properties.stroke - width;
                    })
                    .style("stroke", function (d) {
                        return d.properties.stroke;
                    })
                    .attr("d", path);
        });

        var zoom = d3.behavior.zoom()
                .on("zoom", function () {
                    g.attr("transform", "translate(" +
                            d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
                    g.selectAll("path")
                            .attr("d", path.projection(projection));
                });

        svg.call(zoom)
    };
});