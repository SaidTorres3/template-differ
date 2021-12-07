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
exports.editableObjectToDocx = void 0;
var fs_1 = __importDefault(require("fs"));
var jszip_1 = __importDefault(require("jszip"));
var xml2js_1 = __importDefault(require("xml2js"));
var editableObjectToDocx = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var docxFile = fs_1.default.readFileSync(opts.fileInPath);
                // unzip the file
                var zipHandler = new jszip_1.default();
                zipHandler.loadAsync(docxFile).then(function (zipContent) {
                    var file = zipContent.file("word/document.xml");
                    if (!file) {
                        reject("An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.");
                        return;
                    }
                    file.async('text').then(function (XMLContent) {
                        xml2js_1.default.parseString(XMLContent, function (err, result) {
                            var paragraphs = result['w:document']['w:body'][0]['w:p'];
                            paragraphs.forEach(function (paragraph, paragraphIndex) {
                                var wRLabels = paragraph['w:r'];
                                if (!wRLabels || !wRLabels.length) {
                                    return;
                                }
                                wRLabels.forEach(function (wRLabel, wRLabelIndex) {
                                    var modfiedPhrase = getModifiedPhare(opts.modifiedObjects, { paragraphIndex: paragraphIndex, sentenseIndex: wRLabelIndex });
                                    if (!modfiedPhrase) {
                                        return;
                                    }
                                    console.log('entered...');
                                    // check if WTLabel is an object and has the "_" property
                                    if (wRLabel['w:t'] && wRLabel['w:t'].length && wRLabel['w:t'][0]['_']) {
                                        wRLabel['w:t'][0]['_'] = modfiedPhrase.value;
                                    }
                                    else {
                                        if (wRLabel['w:t'] && wRLabel['w:t'].length && typeof wRLabel['w:t'][0] === 'string') {
                                            wRLabel['w:t'][0] = modfiedPhrase.value;
                                        } // else if (WTLabel && WTLabel.length && WTLabel[0]['$']) {
                                        // }
                                    }
                                });
                            });
                            var modifiedXML = new xml2js_1.default.Builder().buildObject(result);
                            // replace 'file' variable with modifiedXML
                            zipContent.file('word/document.xml', modifiedXML);
                            zipContent.generateAsync({ type: 'base64' }).then(function (outputFile) {
                                fs_1.default.writeFileSync(opts.fileOutPath, outputFile, 'base64');
                            });
                        });
                    });
                });
            })];
    });
}); };
exports.editableObjectToDocx = editableObjectToDocx;
var getModifiedPhare = function (phrases, phaseCoords) {
    var phrase = phrases.find(function (phrase) {
        if (phrase.paragraphIndex === phaseCoords.paragraphIndex && phrase.sentenseIndex === phaseCoords.sentenseIndex) {
            return phrase;
        }
    });
    return phrase;
};
