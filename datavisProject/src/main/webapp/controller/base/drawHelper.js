/* global lineString */

var drawHelper = {};

drawHelper.formatNpList = function (np) {
    var newNpList = [];
    np.forEach(function (point) {
        drawHelper.getKeyList(point).forEach(function (key) {
            newNpList.push(key);
        });
    });
    return newNpList;
};

drawHelper.drawNetwork = function (np, geoPointList, col) {    
    var lineArray = [];
    if(np.length <= 0){
        return lineArray;
    }
    
    var groups = drawHelper.createGroup(np).reverse();

    var temp = [];
    var grouppoints = [];
    groups.forEach(function (g) {
        g.forEach(function (p) {
            grouppoints.push(geoPointList[p]);
        });
        temp.push(grouppoints);
        grouppoints = [];
    });
    groups = temp;

    groups.forEach(function (g) {
        drawHelper.bindGroup(g.slice(0), col).forEach(function (line) {
            lineArray.push(line);
        });
    });
    console.log(groups);
    drawHelper.getGroupConnections(groups.slice(0), col).forEach(function (line) {
        lineArray.push(line);
    });

    return lineArray;
};

drawHelper.getGroupConnections = function (groups, col) {
    var lines = [];
    var res;
    var groupIndex;
    groups.forEach(function (g) {
        if (groups.indexOf(g) > 0) {
            var t = drawHelper.getClosestPoint(groups[0], g);
            if (res === undefined || res.distance > t.distance) {
                res = t;
                groupIndex = groups.indexOf(g);
            }
        }
    });
    
    groups[0] = groups[0].concat(groups[groupIndex]);
    groups.splice(groupIndex, 1);
    lines.push(lineString.makeFeature([res.from[0], res.from[1]], [res.to[0], res.to[1]], col));
    res = undefined;
    
    if (groups.length > 1) {
        drawHelper.getGroupConnections(groups, col).forEach(function (l) {
            lines.push(l);
        });
    }
    return lines;
};

drawHelper.bindGroups = function (groups, geoPointList, col) {
    var lines = [];
    var group = groups.shift();
    var grouppoints = [];
    group.forEach(function (p) {
        grouppoints.push(geoPointList[p]);
    });


    if (grouppoints.length !== 0) {
        var res;
        groups.forEach(function (g) {
            var grouppoints2 = [];
            g.forEach(function (p) {
                grouppoints2.push(geoPointList[p]);
            });

            if (grouppoints2.length !== 0) {
                console.log("grouppoints2.length", grouppoints2, "grouppoints", grouppoints);
                var t = drawHelper.getClosestPoint(grouppoints, grouppoints2);
                if (res === undefined || t.distance < res.distance) {
                    res = t;
                }
                console.log("res,", res);
            }
        });
        lines.push(lineString.makeFeature([res.from[0], res.from[1]], [res.to[0], res.to[1]], col));

    }
    if (groups.length > 1) {
        drawHelper.bindGroups(groups, geoPointList, col);
    }
    ;
    return lines;
};

drawHelper.bindGroup = function (group, col) {
    var lines = [];
    var point = group.shift();

    if (group.length !== 0) {
        var res = drawHelper.getClosestPoint([point], group);
        lines.push(lineString.makeFeature([res.from[0], res.from[1]], [res.to[0], res.to[1]], col));
    }

    if (group.length > 1) {
        drawHelper.bindGroup(group, col).forEach(function (line) {
            lines.push(line);
        });
    }
    return lines;
};

drawHelper.createGroup = function (np) {
    var groups = [];
    var group = [];
    var point = np.shift();
    group.push(point);
    var pointRule = drawHelper.lineRules[point];
    pointRule.forEach(function (rule) {
        if (np.indexOf(rule) > -1 && group.indexOf(rule) === -1) {
            group.push(rule);
            np.splice(np.indexOf(rule), 1);
        }
    });

    if (np.length > 0) {
        drawHelper.createGroup(np).forEach(function (grp) {
            groups.push(grp);
        });
    }
    groups.push(group);
    return groups;
};

drawHelper.getKeyList = function (element) {
    var kList = [];
    Object.keys(drawHelper.lineRules).forEach(function (k) {
        if (k.match(element)) {
            kList.push(k);
        }
    });
    if (kList.length === 0) {
        kList.push(element);
    }
    return kList;
};

drawHelper.getDistance = function (p1, p2) {
    return Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]));
};

drawHelper.getClosestPoint = function (list1, list2) {

    var smallest = {};

    list1.forEach(function (p1) {
        list2.forEach(function (p2) {
            var distance = drawHelper.getDistance(p1, p2);
            if (smallest.distance === undefined || distance < smallest.distance) {
                smallest.distance = distance;
                smallest.from = p1;
                smallest.to = p2;
            }
        });
    });
    return smallest;
};

drawHelper.lineRules = {
    "10a": ["10b", "11c", "15", "20"],
    "10b": ["10a", "11a", "11b", "13a"],
    "11a": ["10b", "13a", "14a"],
    "11b": ["10b", "14a", "15"],
    "11c": ["10a", "13b", "14c", "21", "36"],
    "12": ["13b", "14b", "36", "37a"],
    "13a": ["10b", "11a", "13b", "14b", "38a"],
    "13b": ["11c", "12", "13a", "14b", "36"],
    "14a": ["11a", "11b", "15", "16", "18"],
    "14b": ["12", "13a", "13b"],
    "14c": ["11c", "21", "24", "36"],
    "15": ["10a", "11b", "14a", "19", "20"],
    "16": ["17a", "18", "14a"],
    "17a": ["16", "17b", "18", "87"],
    "17b": ["17a", "88b"],
    "18": ["14a", "16", "19"],
    "19": ["14a", "15", "18", "20"],
    "20": ["10a", "15", "19", "21"],
    "21": ["11c", "14c", "22", "23", "24"],
    "22": ["21", "23", "25"],
    "23": ["21", "22", "24", "27"],
    "24": ["14c", "21", "23", "27", "28", "34", "36"],
    "25": ["22"],
    "26": ["27", "30", "31"],
    "27": ["23", "24", "26", "28"],
    "28": ["24", "27", "29", "34"],
    "29": ["28", "30", "33"],
    "30": ["26", "29", "31"],
    "31": ["26", "30", "32"],
    "32": ["31", "33", "34", "46", "47"],
    "33": ["29", "32", "42a"],
    "34": ["24", "28", "35", "36", "39", "41", "42b"],
    "35": ["34", "36", "37a", "39"],
    "36": ["11c", "12", "13b", "14c", "24", "32", "37a"],
    "37a": ["12", "35", "36", "38a", "38b", "39"],
    "37b": ["38b", "39", "67", "73"],
    "38a": ["13a", "37a", "38b", "82a"],
    "38b": ["37b", "38a", "80"],
    "39": ["34", "35", "37a", "40", "41", "67"],
    "40": ["39", "41", "66"],
    "41": ["39", "40", "42b"],
    "42a": ["33", "42b", "49", "51", "53"],
    "42b": ["33", "34", "41"],
    "43a": ["43b", "44", "45"],
    "43b": ["32", "43a", "44", "46"],
    "44": ["43a", "43b", "45", "46"],
    "45": ["43a", "44"],
    "46": ["32", "43b", "44", "47"],
    "47": ["32", "46", "48"],
    "48": ["47", "49", "51"],
    "49": ["48", "42a", "51", "33"],
    "50": ["51", "52", "55", "56"],
    "51": ["42a", "48", "49", "50"],
    "52": ["50", "53", "54", "56"],
    "53": ["52", "54", "66"],
    "54": ["52", "53", "57", "58"],
    "55": ["50", "56", "57", "60"],
    "56": ["50", "52", "55", "57"],
    "57": ["54", "55", "56", "58", "59", "60"],
    "58": ["54", "57", "59"],
    "59": ["57", "58", "60"],
    "60": ["55", "57", "59", "61"],
    "61": ["60", "63a", "64"],
    "62": ["63a"],
    "63a": ["61", "62", "64"],
    "63b": ["64"],
    "64": ["61", "63a", "63b"],
    "65": ["54", "66"],
    "66": ["40", "53", "65", "67", "68"],
    "67": ["37b", "39", "66", "68", "73"],
    "68": ["66", "67", "69", "73"],
    "69": ["68", "70", "72", "73"],
    "70": ["69", "71", "72"],
    "71": ["70", "72"],
    "72": ["69", "70", "71", "73", "74"],
    "73": ["37b", "38b", "67", "68", "69", "70", "72", "81"],
    "74": ["72", "75", "76", "81"],
    "75": ["74", "76"],
    "76": ["74", "75", "77"],
    "77": ["76", "78", "79", "80", "81"],
    "78": ["77", "79", "94", "95"],
    "79": ["77", "78", "80", "83", "94"],
    "80": ["38b", "77", "81", "82a", "82b"],
    "81": ["73", "74", "77", "80"],
    "82a": ["38a", "80", "82b", "83"],
    "82b": ["80", "82a", "83"],
    "83": ["79", "82a", "82b", "84", "85"],
    "84": ["83", "85", "92", "94"],
    "85": ["83", "84", "86", "87"],
    "86": ["85", "87"],
    "87": ["17a", "86", "88a"],
    "88a": ["87", "90"],
    "88b": ["17b", "88c"],
    "88c": ["88b", "91b"],
    "89": ["90", "92"],
    "90": ["88a", "89", "91a"],
    "91a": ["90", "91b", "92", "99"],
    "91b": ["88c", "91a", "91c"],
    "91c": ["91a"],
    "92": ["84", "89", "91a", "98"],
    "93": ["94", "97", "98"],
    "94": ["78", "79", "84", "93", "95", "96", "97"],
    "95": ["78", "94", "96"],
    "96": ["94", "95", "97"],
    "97": ["93", "94", "96", "98", "99"],
    "98": ["92", "93", "97", "99"],
    "99": ["97", "98"]
};