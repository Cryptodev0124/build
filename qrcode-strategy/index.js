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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lightQR = exports.darkQR = exports.QRCodeStrategy = exports.logo = exports.QRCode = void 0;
const HereStrategy_1 = require("../strategies/HereStrategy");
const qrcode_1 = __importDefault(require("./qrcode"));
exports.QRCode = qrcode_1.default;
const logo_1 = __importDefault(require("./logo"));
exports.logo = logo_1.default;
class QRCodeStrategy extends HereStrategy_1.HereStrategy {
    constructor(options) {
        var _a;
        super();
        this.options = options;
        this.endpoint = (_a = options.endpoint) !== null && _a !== void 0 ? _a : "https://my.herewallet.app/request";
    }
    get themeConfig() {
        return this.options.theme === "light" ? exports.lightQR : exports.darkQR;
    }
    onRequested(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.qrcode = new qrcode_1.default(Object.assign(Object.assign(Object.assign({}, this.themeConfig), this.options), { value: `${this.endpoint}/${id}` }));
            this.options.element.appendChild(this.qrcode.canvas);
            this.options.animate ? this.qrcode.animate() : this.qrcode.render();
        });
    }
    close() {
        var _a;
        if (this.qrcode == null)
            return;
        this.options.element.removeChild(this.qrcode.canvas);
        (_a = this.qrcode) === null || _a === void 0 ? void 0 : _a.stopAnimate();
    }
    onApproving(result) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onFailed(result) {
        return __awaiter(this, void 0, void 0, function* () {
            this.close();
        });
    }
    onSuccess(result) {
        return __awaiter(this, void 0, void 0, function* () {
            this.close();
        });
    }
}
exports.QRCodeStrategy = QRCodeStrategy;
exports.darkQR = {
    value: "",
    radius: 0.8,
    ecLevel: "H",
    fill: {
        type: "linear-gradient",
        position: [0, 0, 1, 1],
        colorStops: [
            [0, "#2C3034"],
            [0.34, "#4F5256"],
            [1, "#2C3034"],
        ],
    },
    size: 256,
    withLogo: true,
    imageEcCover: 0.7,
    quiet: 1,
};
exports.lightQR = {
    value: "",
    radius: 0.8,
    ecLevel: "H",
    fill: {
        type: "linear-gradient",
        position: [0.3, 0.3, 1, 1],
        colorStops: [
            [0, "#FDBF1C"],
            [1, "#FDA31C"],
        ],
    },
    size: 256,
    withLogo: true,
    imageEcCover: 0.7,
    quiet: 1,
};
//# sourceMappingURL=index.js.map