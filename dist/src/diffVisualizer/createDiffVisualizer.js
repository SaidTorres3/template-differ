"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDiffVisualizer = void 0;
var fs_1 = require("fs");
var jsdom_1 = require("jsdom");
var createDiffVisualizer = function (opts) {
    var html = (0, fs_1.readFileSync)('src/diffVisualizer/diffTemplate.html', 'utf8');
    var dom = new jsdom_1.JSDOM(html);
    var outputPart = '';
    var templatePart = '';
    opts.diff.forEach(function (change) {
        if (change.added) {
            outputPart += "<span class=\"addedElement\">".concat(change.value, "</span>");
        }
        else if (change.removed) {
            templatePart += "<span class=\"deletedElement\">".concat(change.value, "</span>");
        }
        else {
            outputPart += "<span>".concat(change.value, "</span>");
            templatePart += "<span>".concat(change.value, "</span>");
        }
    });
    dom.window.document.getElementById("output").innerHTML = outputPart;
    dom.window.document.getElementById("template").innerHTML = templatePart;
    if (opts.dataPath) {
        var data = JSON.parse((0, fs_1.readFileSync)(opts.dataPath, 'utf8'));
        var dataShowerElement_1 = dom.window.document.getElementById('data-shower');
        var addDataToHTML_1 = function (object, path) {
            if (object instanceof Object) {
                Object.entries(object).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    return addDataToHTML_1(value, "".concat(path, ".").concat(key));
                });
            }
            else {
                if (dataShowerElement_1)
                    dataShowerElement_1.innerHTML += "<span>".concat((path + ": " + object + '\r\n'), "</span>");
            }
        };
        addDataToHTML_1(data, 'data');
    }
    var htmlDiff = dom.serialize();
    (0, fs_1.writeFileSync)(opts.savePath, htmlDiff);
};
exports.createDiffVisualizer = createDiffVisualizer;
