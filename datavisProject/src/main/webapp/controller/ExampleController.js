app.registerCtrl('ExampleController', function ($scope, $http) {
    var self = this;
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) * .5;
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 200 - 170;
    self.scale = 5400;

    $scope.years = [2009, 2010, 2012, 2013, 2014, 2015];
    $scope.selectedYear = "Select a year...";

    $scope.selectedCompany = "Select a energy company...";
    $scope.companies = ["Liander", "Enexis", "Endinet"];

    self.requestData = function (year, company) {
        $http({
            method: 'GET',
            url: 'resources/data/elk/' + company + '/' + year
        }).then(function successCallback(response) {
            console.log(response);
            self.usagescale = response.data.usagescale;
            self.draw();
        }, function errorCallback(response) {
            console.log("oh no it went wong =C!");
        });
    };

    self.requestData = function (year) {
        $http({
            method: 'GET',
            url: 'resources/data/elk/' + year
        }).then(function successCallback(response) {
            console.log(response);
            self.usagescale = response.data.usagescale;
            self.draw();
        }, function errorCallback(response) {
            console.log("oh no it went wong =C!");
        });
    };

    $scope.onYearChange = function (year) {
        $scope.selectedYear = year;
        
        if ($scope.selectedCompany === "Select a energy company...") {
            console.log("filter year: " + year + ", comp: all");
            self.requestData(year);
        } else {
            console.log("filter year: " + year + ", comp: " + $scope.selectedCompany);
            self.requestData(year, $scope.selectedCompany);
        }
    };

    $scope.onCompanyChange = function (company) {
        $scope.selectedCompany = company;
        if($scope.selectedYear !== "Select a year..."){
            self.requestDataCompany($scope.selectedYear, company);
        } else {
            alert("Pleas select a year");
        }
        
    };

    self.init = function () {
        self.requestData(0);
    };

    self.draw = function () {
        var projection = d3.geo.mercator()
                .scale(this.scale)
                .translate([width / 2, height / 2]);

        d3.select("svg").remove();
        var svg = d3.selectAll(".map").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "datavisPannel");

        var path = d3.geo.path()
                .projection(projection);

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
                        var col = d.properties.fill;
                        if (self.usagescale.hasOwnProperty(d.properties.postcode)) {
                            col = self.usagescale[d.properties.postcode];
                        }
                        return col;
                    })
                    .attr("stroke-width", function (d) {
                        return d.properties['stroke-width'];
                    })
                    .attr("stroke", function (d) {
                        return d.properties.stroke;
                    })
                    .attr("d", path)
                    .on("mouseover", function (d) {
                        d3.select("div .tooltiphelper").text("Postcode gebied: " + d.properties.postcode);
                        var element = d3.selectAll("path[id='" + d.properties.postcode + "']");

                        element.style("opacity", .8);
                        element.attr("stroke-width", 0);
                    })
                    .on("mouseout", function (d) {
                        d3.select("div .tooltiphelper").text("");
                        var element = d3.selectAll("path");

                        element.style("opacity", 1);
                        element.attr("stroke-width", d.properties['stroke-width']);
                    });
        });

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

        var zoom = d3.behavior.zoom()
                .on("zoom", function () {
                    g.attr("transform", "translate(" +
                            d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
                    g.selectAll("path")
                            .attr("d", path.projection(projection));
                });

        svg.call(zoom);
    };

    self.init();
});