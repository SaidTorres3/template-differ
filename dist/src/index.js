"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplateOutputDiffVisualizer = exports.editableObjectToDocx = exports.docxToEditableObjects = void 0;
var createDiffVisualizer_1 = require("./diffVisualizer/createDiffVisualizer");
var compareTwoDocx_1 = require("./diffGenerator/compareTwoDocx");
var docxToEditableObjects_1 = require("./docxParser/docxToEditableObjects");
Object.defineProperty(exports, "docxToEditableObjects", { enumerable: true, get: function () { return docxToEditableObjects_1.docxToEditableObjects; } });
var editableObjectToDocx_1 = require("./docxParser/editableObjectToDocx");
Object.defineProperty(exports, "editableObjectToDocx", { enumerable: true, get: function () { return editableObjectToDocx_1.editableObjectToDocx; } });
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
