/* global lineString */

var drawHelper = {};
drawHelper.formatNpList = function(np) {
    var newNpList = [];
    np.forEach(function(point){
        drawHelper.getKeyList(point).forEach(function(key){
            newNpList.push(key);
        });
    });
    return newNpList;
};

drawHelper.drawNetwork = function (np, pointList, col) {
    np = drawHelper.formatNpList(np);
    var lineArray = [];
    var points = np;
    var firstElement = points.shift();
    var secondElement = points[0];

    var firstKeyList = drawHelper.getKeyList(firstElement);
    var secondKeyList = drawHelper.getKeyList(secondElement);
    var previousKey;
    firstKeyList.forEach(function (fk) {
        var rules = drawHelper.lineRules[fk];

        if (previousKey !== undefined) {
            if (rules !== undefined && rules.indexOf(previousKey) !== -1) {
                lineArray.push(lineString.makeFeature([pointList[fk][0], pointList[fk][1]], [pointList[previousKey][0], pointList[previousKey][1]], col));
            }
        }
        secondKeyList.forEach(function (sk) {
            if (rules !== undefined && rules.indexOf(sk) !== -1) {
                lineArray.push(lineString.makeFeature([pointList[fk][0], pointList[fk][1]], [pointList[sk][0], pointList[sk][1]], col));
            }
        });
        previousKey = fk;
    });

    //recursive stuff
    if (points.length !== 0) {
        drawHelper.drawNetwork(points, pointList, col).forEach(function (l) {
            lineArray.push(l);
        });
    }

    return lineArray;

//    var points = np;
//    var lineArray = [];
//    var firstElement = points.shift();
//    var secondElement = points[0];
//
//    var firstKeyList = undefined;
//    var secondKeyList = undefined;
//    var la = drawHelper.lineRules[firstElement];
//
//    if (!drawHelper.lineRules.hasOwnProperty(firstElement)) {
//        firstKeyList = drawHelper.getKeyList(firstElement);
//    }
//
//    if (!drawHelper.lineRules.hasOwnProperty(secondElement)) {
//        secondKeyList = drawHelper.getKeyList(secondElement);
//    }
//
//    if (firstKeyList !== undefined) {
//        var previousKey;
//        firstKeyList.forEach(function (fk) {
//            var rules = drawHelper.lineRules[fk];
//            if (previousKey !== undefined) {
//                if (rules.indexOf(previousKey) !== -1) {
//                    lineArray.push(lineString.makeFeature([drawHelper.pointList[fk][0], drawHelper.pointList[fk][1]], [drawHelper.pointList[previousKey][0], drawHelper.pointList[previousKey][1]], col));
//                }
//            }
//            if (secondKeyList !== undefined) {
//                secondKeyList.forEach(function (sk) {
//                    if (rules.indexOf(sk) !== -1) {
//                        lineArray.push(lineString.makeFeature([drawHelper.pointList[fk][0], drawHelper.pointList[fk][1]], [drawHelper.pointList[sk][0], drawHelper.pointList[sk][1]], col));
//                    }
//                });
//            }
//            previousKey = fk;
//        });
//    } else {
//        var rules = drawHelper.lineRules[firstElement];
//        if (previousKey !== undefined) {
//            if (rules.indexOf(previousKey) !== -1) {
//                lineArray.push(lineString.makeFeature([drawHelper.pointList[firstElement][0], drawHelper.pointList[firstElement][1]], [drawHelper.pointList[previousKey][0], drawHelper.pointList[previousKey][1]], col));
//            }
//        }
//        if (secondKeyList !== undefined) {
//            console.log("secondKeyList: ");
//            console.log(secondKeyList);
//            console.log("end");
//            console.log("pointlist");
//            console.log(drawHelper.pointList);            
//            secondKeyList.forEach(function (sk) {
//                if (rules.indexOf(sk) !== -1) {
//                console.log("sk");
//                console.log(sk);
//                    console.log("point list:"+ firstElement);
//                    console.log(drawHelper.pointList[firstElement]);
//                    console.log("point list:"+ sk);
//                    console.log(drawHelper.pointList[sk]);
////                    lineArray.push(lineString.makeFeature([drawHelper.pointList[firstElement][0], drawHelper.pointList[firstElement][1]], [drawHelper.pointList[sk][0], drawHelper.pointList[sk][1]], col));
//                }
//            });
//        }
//        previousKey = firstElement;
//    }
//
//
//    if (points.length !== 0) {
//        drawHelper.drawNetwork(points, col).forEach(function (l) {
//            lineArray.push(l);
//        });
//    }
//    return lineArray;
//    console.log(firstElement);
//    console.log(la);
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
    "91c": ["91b"],
    "92": ["84", "89", "91a", "98"],
    "93": ["94", "97", "98"],
    "94": ["78", "79", "84", "93", "95", "96", "97"],
    "95": ["78", "94", "96"],
    "96": ["94", "95", "97"],
    "97": ["93", "94", "96", "98", "99"],
    "98": ["92", "93", "97", "99"],
    "99": ["97", "98"]

};


//getPointDistance util function to draw lines which calculates the distance between points
var beenAt = [];
var lastbeenAt = [];
var origin;
var distance = 0;
var getPointDistance = function (up, fp) {
    var p = null;
    var rules = drawHelper.lineRules[fp];
    if (origin === undefined) {
        origin = fp;
    }
    if (beenAt.length === 0) {
        beenAt.push(fp);
    }

    rules.forEach(function (r) {
        if (p === null) {
            if (up !== r) {
                if (beenAt.indexOf(r) < 0) {
                    beenAt.push(r);
                    distance++;
                    p = getPointDistance(up, r);
                    distance--;
                }
            } else {
                p = {d: distance + 1, been: beenAt, from: origin, to: r};
                lastbeenAt = beenAt;
                beenAt = [];
                distance = 0;
            }
        } else {
            if (up !== r) {
                if (beenAt.indexOf(r) < 0) {

                    if (lastbeenAt[distance - 1] !== undefined && lastbeenAt[distance - 1] !== r) {
                        distance++;
                        var t = getPointDistance(up, r);
                        if (t.d < p.d) {
                            p = t;
                        }
                        distance--;
                    }
                }
            } else {
                if (p.d > distance) {
                    p = {d: distance + 1, been: beenAt, from: origin, to: r};
                    lastbeenAt = beenAt;
                    beenAt = [];
                }
            }
        }
    });
    return p;
};

var usedpoint = "52";
var cannotgetto = "98";
console.log("rout: ", getPointDistance(usedpoint, cannotgetto));