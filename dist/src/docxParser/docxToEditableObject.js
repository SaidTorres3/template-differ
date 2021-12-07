"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docxToEditableObjects = void 0;
var fs_1 = __importDefault(require("fs"));
var jszip_1 = __importDefault(require("jszip"));
var xml2js_1 = require("xml2js");
var docxToEditableObjects = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var docxFile = fs_1.default.readFileSync(filePath);
                // unzip the file
                var zip = new jszip_1.default();
                zip.loadAsync(docxFile).then(function (zip) {
                    // get the content of the document.xml file
                    var wordFolder = zip.folder('word');
                    if (!wordFolder) {
                        reject("An error ocurred attempting to enter to the folder 'word' of the docx file.");
                        return;
                    }
                    var file = wordFolder.file("document.xml");
                    if (!file) {
                        reject("An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.");
                        return;
                    }
                    file.async('string').then(function (XMLContent) {
                        var phrases = [];
                        (0, xml2js_1.parseString)(XMLContent, function (err, result) {
                            var paragraphs = result['w:document']['w:body'][0]['w:p'];
                            var enter = '\r\n';
                            paragraphs.forEach(function (paragraph, paragraphIndex) {
                                var wRLabels = paragraph['w:r'];
                                if (!wRLabels || !wRLabels.length) {
                                    return;
                                }
                                wRLabels.forEach(function (wRLabel, wRLabelIndex) {
                                    var text = '';
                                    var WTLabel = wRLabel['w:t'];
                                    // check if WTLabel is an object and has the "_" property
                                    if (WTLabel && WTLabel.length && WTLabel[0]['_']) {
                                        text = WTLabel[0]['_'];
                                    }
                                    else {
                                        if (WTLabel && WTLabel.length && typeof WTLabel[0] === 'string') {
                                            text = WTLabel[0];
                                        }
                                        else if (WTLabel && WTLabel.length && WTLabel[0]['$']) {
                                            text = " ";
                                        }
                                    }
                                    var phrase = { value: text, paragraphIndex: paragraphIndex, sentenseIndex: wRLabelIndex };
                                    phrases.push(phrase);
                                    console.log(phrase);
                                });
                            });
                            resolve(phrases);
                        });
                    });
                });
            })];
    });
}); };
exports.docxToEditableObjects = docxToEditableObjects;
