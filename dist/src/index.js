"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplateOutputDiffVisualizer = void 0;
var createDiffVisualizer_1 = require("./diffVisualizer/createDiffVisualizer");
var compareTwoDocx_1 = require("./diffGenerator/compareTwoDocx");
var createTemplateOutputDiffVisualizer = function (opts) {
    (0, compareTwoDocx_1.compareTwoDocx)(opts.templatePath, opts.templateOutputPath).then(function (diff) {
        (0, createDiffVisualizer_1.createDiffVisualizer)({
            diff: diff,
            savePath: opts.savePath,
            dataPath: opts.dataPath
        });
    });
};
exports.createTemplateOutputDiffVisualizer = createTemplateOutputDiffVisualizer;
