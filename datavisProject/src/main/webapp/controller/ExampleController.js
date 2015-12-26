app.registerCtrl('ExampleController', function ($scope, $http, $q) {

    var self = this;

    var width = d3.select(".map").node().getBoundingClientRect().width;
    var h = d3.select(".navbar").node().getBoundingClientRect();
    var f = d3.select("footer").node().getBoundingClientRect();
    var t = d3.select("h1").node().getBoundingClientRect();
    var m = 30 + 20;
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - h.height - f.height - t.height - m;
    var tooltipDiv;

    self.scale = 5400;

    $scope.canceler = null;
    $scope.years = [
        {"id": 2009, "name": "2009", "assignable": true},
        {"id": 2010, "name": "2010", "assignable": true},
        {"id": 2011, "name": "2011", "assignable": true},
        {"id": 2012, "name": "2012", "assignable": true},
        {"id": 2013, "name": "2013", "assignable": true},
        {"id": 2014, "name": "2014", "assignable": true},
        {"id": 2015, "name": "2015", "assignable": true}
    ];
    $scope.preselectYears = {years: []};
    $scope.selectedYear = "Select a year...";
    $scope.selected_years = [];

    $scope.companies = [
        {"id": "Liander", "name": "Liander", "assignable": true},
        {"id": "Enexis", "name": "Enexis", "assignable": true},
        {"id": "Endinet", "name": "Endinet", "assignable": true}
    ];
    $scope.preselectCompanies = {companies: []};
    $scope.selectedcompany = "Select a energy company...";
    $scope.selected_companies = [];

    $scope.timeouthandler = function () {
        if ($scope.canceler === null) {
            $scope.canceler = $q.defer();
        } else {
            $scope.canceler.resolve();
            $scope.canceler = $q.defer();
        }
    };

    self.requestDataCompany = function (year, company) {
        d3.select("svg").remove();
        d3.select(".map").append("div")
                .attr("class", "spinner");

        $scope.timeouthandler();

        $http({
            timeout: $scope.canceler.promise,
            method: 'GET',
            url: 'resources/data/elk/' + company + '/' + year
        }).then(function successCallback(response) {
            console.log(response);
            $scope.request = null;
            self.usagescale = response.data.usagescale;
            self.draw();
            d3.select(".spinner").remove();
        }, function errorCallback(response) {
            console.log("oh no it went wong -.-!");
            $scope.request = null;
            d3.select(".spinner").remove();
        });

    };

    self.requestData = function (year) {
        d3.select("svg").remove();
        d3.select(".map").append("div")
                .attr("class", "spinner");
        $scope.timeouthandler();

        $http({
            timeout: $scope.canceler.promise,
            method: 'GET',
            url: 'resources/data/elk/' + year
        }).then(function successCallback(response) {
            console.log(response);
            $scope.request = null;
            self.usagescale = response.data.usagescale;
            self.draw();
            d3.select(".spinner").remove();
        }, function errorCallback(response) {
            console.log("oh no it went wong =C!");
            $scope.request = null;
            d3.select(".spinner").remove();
        });

    };

    $scope.onYearChange = function (year) {
        if (year.length === 0) {
            year = '0';
        } else {
            year = year.toString().substring(0, year.toString().length);
            console.log(year);
        }

        if ($scope.selectedCompany === "Select a energy company..." && $scope.selectedCompany !== 'undefined') {
            console.log("filter year: " + year + ", comp: all");
            self.requestData(year);
        } else {
            console.log("filter year: " + year + ", comp: " + $scope.selectedCompany);
            self.requestDataCompany(year, $scope.selectedCompany);
        }
    };

    $scope.onCompanyChange = function (company) {
        console.log("shiiit");
        console.log(company.toString().length);
        console.log(company.toString());
        if (company.toString().length > 0 && company.toString() !== 'undefined') {
            $scope.selectedCompany = company;
            console.log("selectedyear");
            console.log($scope.selectedYear);

            if ($scope.selectedYear !== "Select a year...") {
                self.requestDataCompany($scope.selectedYear, company.toString());
            } else {
                self.requestDataCompany("0", company.toString());
            }
        }
        {
            if ($scope.selectedYear !== "Select a year...") {
                self.requestData("0");
            } else {
                self.requestData($scope.selectedYear);
            }
        }
    };

    self.init = function () {
        d3.selectAll(".map").attr("style", "height:" + height + "px;");

        $scope.$watch('selected_years.length', function () {
            if ($scope.selected_years.lenght !== 0) {
                $scope.onYearChange($scope.selected_years);
            }
        });

        $scope.$watch('selected_companies.length', function () {
            if ($scope.selected_companies.lenght !== 0) {
                $scope.onCompanyChange($scope.selected_companies);
            }
        });
    };

    self.draw = function () {
        var projection = d3.geo.mercator()
                .scale(this.scale)
                .translate([width / 2, height / 2]);

        d3.select("svg").remove();
        var svg = d3.selectAll(".map").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("style", "height:" + height + "px;")
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
                        if (typeof self.usagescale !== "undefined" && self.usagescale.hasOwnProperty(d.properties.postcode)) {
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
                        var element = d3.selectAll("path[id='" + d.properties.postcode + "']");
                        element.style("opacity", .8);
                        element.attr("stroke-width", 0);

                        d3.select('.map').selectAll('.tooltip').remove();
                        tooltipDiv = d3.select('.map').append('div').attr('class', 'tooltip');
                        var absoluteMousePos = d3.mouse(d3.select('.map').node());
                        tooltipDiv.style('left', (absoluteMousePos[0] + 30) + 'px')
                                .style('top', (absoluteMousePos[1] - 30) + 'px');
                        var tooltipText = d.properties.postcode;
                        tooltipDiv.html(tooltipText);

                    })
                    .on("mousemove", function (d) {
                        var absoluteMousePos = d3.mouse(d3.select('.map').node());
                                    tooltipDiv.style('left', (absoluteMousePos[0] + 30) + 'px')
                                                .style('top', (absoluteMousePos[1] - 30) + 'px');
                                    var tooltipText = d.properties.postcode;
                                    tooltipDiv.html(tooltipText);
                    })
                    .on("mouseout", function (d) {
                        var element = d3.selectAll("path");
                        element.style("opacity", 1);
                        element.attr("stroke-width", d.properties['stroke-width']);
                        tooltipDiv.remove();
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