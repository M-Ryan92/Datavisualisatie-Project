/* global d3, app, behaviour, lineString, drawHelper, item */

app.registerCtrl('ExampleController', function ($scope, $http, $q) {

    var self = this;

    var width = d3.select(".map").node().getBoundingClientRect().width;
    var h = d3.select(".navbar").node().getBoundingClientRect();
    var f = d3.select("footer").node().getBoundingClientRect();
    var t = d3.select("h1").node().getBoundingClientRect();
    var m = 30 + 20;
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - h.height - f.height - t.height - m;

    var color = d3.scale.quantize()
            .domain([0, 30000000, 80000000, 120000000, 160000000])
            .range(["#87CEEB", "#00BFFF", "#4682B4", "#0000FF", "#000080"]);

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

    $scope.type = 'elk';

    $scope.timeouthandler = function () {
        if ($scope.canceler === null) {
            $scope.canceler = $q.defer();
        } else {
            $scope.canceler.resolve();
            $scope.canceler = $q.defer();
        }
    };

    self.requestDataCompany = function (year, company) {
        d3.select("svg.datavisPannel").remove();
        d3.select(".map").append("div")
                .attr("class", "spinner");

        $scope.timeouthandler();

        $http({
            timeout: $scope.canceler.promise,
            method: 'GET',
            url: 'resources/data/' + $scope.type + '/' + company + '/' + year
        }).then(function successCallback(response) {
            console.log(response);
            self.usagescale = response.data.usagescale;
            self.networkPoints = response.data.networkPoints;
            self.usage = response.data.usage;
            self.draw();
            d3.select(".spinner").remove();
        }, function errorCallback(response) {
            console.log("oh no it went wong -.-! companychange");
            d3.select(".spinner").remove();
        });

    };

    self.requestData = function (year) {
        d3.select("svg.datavisPannel").remove();
        d3.select(".map").append("div")
                .attr("class", "spinner");
        $scope.timeouthandler();

        $http({
            timeout: $scope.canceler.promise,
            method: 'GET',
            url: 'resources/data/' + $scope.type + '/' + year
        }).then(function successCallback(response) {
            console.log(response);
            self.usagescale = response.data.usagescale;
            self.networkPoints = response.data.networkPoints;
            self.usage = response.data.usage;
            self.draw();
            d3.select(".spinner").remove();
        }, function errorCallback(response) {
            console.log("oh no it went wong -.-! yearchange");
            d3.select(".spinner").remove();
        });
    };

    $scope.onYearChange = function (year) {
        if (year.length === 0) {
            year = '0';
        } else {
            year = year.toString().substring(0, year.toString().length);
        }

        if ($scope.selected_companies.length === 0) {
            console.log("filter year: " + year + ", comp: all");
            self.requestData(year);
        } else {
            console.log("filter year: " + year + ", comp: " + $scope.selected_companies.toString());
            self.requestDataCompany(year, $scope.selected_companies.toString());
        }
    };

    $scope.onCompanyChange = function (company) {
        if (company.toString().length === 0) {
            if ($scope.selected_years.length === 0) {
                console.log("filter year: 0, comp: all");
                self.requestData("0");
            } else {
                console.log("filter year: " + $scope.selected_years + ", comp: all");
                self.requestData($scope.selected_years);
            }
        } else {
            if ($scope.selected_years.length === 0) {
                console.log("filter year: 0, comp: " + $scope.selected_companies.toString());
                self.requestDataCompany("0", company.toString());
            } else {
                console.log("filter year: " + $scope.selected_years + ", comp: " + $scope.selected_companies.toString());
                self.requestDataCompany($scope.selected_years, company.toString());
            }
        }
    };

    self.init = function () {
        d3.selectAll(".map").attr("style", "height:" + height + "px;");

        $scope.$watch('selected_years.length', function () {
            $scope.onYearChange($scope.selected_years);
        });

        $scope.$watch('selected_companies.length', function () {
            $scope.onCompanyChange($scope.selected_companies);
        });

        $scope.$watch('type', function () {
            if ($scope.selected_companies.toString().length > 0) {
                $scope.onCompanyChange($scope.selected_companies);
            } else {
                $scope.onYearChange($scope.selected_years);
            }
        });

        var legend = d3.legend.color()
                .title("Usage (in sjv)")
                .labelFormat(function (d) {
                    if (d >= 1e6) {
                        return d / 1e6 + "M";
                    }
                    if (d >= 1e3) {
                        return d / 1e3 + "K";
                    }
                    return d;
                })
                .useClass(false)
                .scale(color);

        d3.select("svg.legend").attr("height", 120).call(legend);
        d3.select("svg.legend .legendTitle").attr("transform", "translate(0,15)");
        d3.selectAll(".legend text").attr("font-weight", "700").attr("fill", "blanchedalmond");
        d3.selectAll(".legendCells .cell>.swatch")
                .style("stroke", "blanchedalmond")
                .style("stroke-width", 1);
    };

    self.draw = function () {
        var projection = d3.geo.mercator()
                .scale(this.scale)
                .translate([width / 2, height / 2]);

        d3.select("svg.datavisPannel").remove();
        var svg = d3.selectAll(".map").append("svg")
                .attr("width", width)
                .attr("style", "height:" + (height - 2) + "px;")
                .attr("class", "datavisPannel");

        var path = d3.geo.path()
                .projection(projection);

        var g = svg.append("g");

        d3.json("map.json", function (error, nld) {
            var pointList = {};
            nld.features.forEach(function (feature) {
                if (feature.geometry.type === "Point") {
                    pointList[feature.properties.point] = feature.geometry.coordinates;
                }

                if (feature.geometry.type === "Polygon") {
                    feature.geometry.coordinates.forEach(function (coords) {
                        coords.reverse();
                    });
                }
            });
            var last = null;
            var next = null;
            var lineColors = {};
            lineColors.Endinet = "#ffa64d";//orange
            lineColors.Enexis = "#9966ff";//pink/purple
            lineColors.Liander = "#d9ff66";//green

            var temp = nld.features.filter(item => item.geometry.type === "Point");
            //change the main array points should de drawn as last
            nld.features = nld.features.filter(item => item.geometry.type !== "Point");

            for (var companyNetwork in self.networkPoints) {
                drawHelper.drawNetwork(self.networkPoints[companyNetwork], pointList, lineColors[companyNetwork]).forEach(function(l){
                    nld.features.push(l);
                });

//                self.networkPoints[npC].forEach(function (np) {
//
//                    if (last !== null && next === null) {
//                        next = np;
//
//                        if (pointList.hasOwnProperty(last) === false) {
//                            last += "a";
//                        }
//
//                        if (pointList.hasOwnProperty(next) === false) {
//                            next += "a";
//                        }
//
//                        if (pointList.hasOwnProperty(last) && pointList.hasOwnProperty(next)) {
//                            nld.features.push(lineString.makeFeature([pointList[last][0], pointList[last][1]], [pointList[next][0], pointList[next][1]], lineColors[npC]));
//                        }
//
//                        last = next;
//                        next = null;
//                    }
//
//                    if (last === null) {
//                        last = np;
//                    }
//                });
            }
            ;

            //add points back into the main array
            temp.forEach(function (item) {
                nld.features.push(item);
            });

            projection.center([(nld.bbox[0] + nld.bbox[2]) / 2, (nld.bbox[1] + nld.bbox[3]) / 2]);
            g.selectAll("path")
                    .data(nld.features)
                    .enter()
                    .append("path")
                    .attr("class", "boundary")
                    .attr("id", function (d) {
                        return behaviour.get(d).id();
                    })
                    .attr("fill", function (d) {
                        return behaviour.get(d).fill(color, self.usage);
                    })
                    .attr("stroke-width", function (d) {
                        return behaviour.get(d).strokeWidth();
                    })
                    .attr("stroke", function (d) {
                        return behaviour.get(d).stroke();
                    })
                    .attr("d", path)
                    .attr("transform", function (d) {
                        return behaviour.get(d).radius();
                    })
                    .on("mouseover", function (d) {
                        behaviour.get(d).mouseover();
                    })
                    .on("mousemove", function (d) {
                        behaviour.get(d).mousemove();
                    })
                    .on("mouseout", function (d) {
                        behaviour.get(d).mouseout();
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