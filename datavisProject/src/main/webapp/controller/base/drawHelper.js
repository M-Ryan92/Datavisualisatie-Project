var drawHelper = {};

drawHelper.drawNetwork = function (np, pl) {

    var firstElement = np.shift();
    var secondElement = np[0];

    var firstKeyList, secondKeyList;
    console.log(secondElement);
    var la = drawHelper.lineRules[firstElement];

    if (!drawHelper.lineRules.hasOwnProperty(firstElement)) {
        firstKeyList = drawHelper.getKeyList(firstElement);
    }

    if (!drawHelper.lineRules.hasOwnProperty(secondElement)) {
        secondKeyList = drawHelper.getKeyList(secondElement);
    }

    if (firstKeyList !== undefined) {
        var previousKey;
        firstKeyList.forEach(function (fk) {
            var rules = drawHelper.lineRules[fk];
            if (previousKey !== undefined) {
                if (rules.indexOf(previousKey) !== -1) {

                    drawHelper.createLine(pl[fk], pl[previousKey]);



                }
            }
            if (secondKeyList !== undefined) {
                secondKeyList.forEach(function (sk) {
                    if (rules.indexOf(sk) !== -1) {
                        drawHelper.createLine(pl[fk], pl[sk]);

                    }
                });
            }
            previousKey = fk;
        });
    }
    console.log(firstElement);
    console.log(la);
};

drawHelper.getKeyList = function (element) {
    var kList = [];
    Object.keys(drawHelper.lineRules).forEach(function (k) {
        if (k.match(element)) {
            kList.push(k);
        }
    });
    return kList;
};

drawHelper.createLine = function (sp, ep) {
    lineString.makeFeature([sp[0], [sp][1]], [ep[0], [ep][1]]);
//    lineString.makeFeature([sp[0], pointList[last][1]], [pointList[next][0], pointList[next][1]], lineColors[npC]);
    console.log(sp, ep);
};

drawHelper.lineRules = {
    "10a": ["10b", "11c", "15", "20"],
    "10b": ["10a", "11a", "11b", "13a"],
    "11a": ["10b", "13a", "14a"],
    "11b": ["10b", "14a", "15"],
    "11c": ["10a", "13b", "14c", "21", "36"],
    "12": ["13b", "14b", "36", "37"],
    "13a": ["10b", "11a", "13b", "14b", "38a"],
    "13b": ["11c", "12", "13a", "14b", "36"],
    "14a": ["11a", "11b", "15", "16", "18"],
    "14b": ["12", "13a", "13b"],
    "14c": ["11c", "21", "24", "36"],
    "15": ["10a", "11b", "14a", "19", "20"],
    "16": ["17a", "18", "14a"],
    "17a": ["16", "17b", "18", "87"],
    "17b": ["17a"],
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
    "32": ["31", "33", "34b", "46", "47"],
    "33": ["29", "32", "42a"],
    "34": ["24", "28", "35", "36", "39", "41", "42b"],
    "35": ["34", "36", "37", "39"],
    "36": ["11c", "12", "13b", "14c", "24", "32", "37"],
    "37": ["12", "35", "36", "38a", "38b", "39"],
    "38a": ["13a", "37a", "38b", "82a"],
    "38b": ["37b", "38a", "80"],
    "39": ["34", "35", "37", "40", "41", "67"],
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
    "49": ["48", "42", "51", "33"]
};
console.log("lineRules");
console.log(drawHelper.lineRules);
console.log("end of lineRules");
