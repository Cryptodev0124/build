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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowStrategy = void 0;
const HereStrategy_1 = require("./HereStrategy");
class WindowStrategy extends HereStrategy_1.HereStrategy {
    constructor(endpoint = "https://my.herewallet.app") {
        super();
        this.endpoint = endpoint;
        this.signWindow = null;
    }
    onInitialized() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.signWindow)
                return;
            const left = window.innerWidth / 2 - 420 / 2;
            const top = window.innerHeight / 2 - 700 / 2;
            this.signWindow = window.open(`${this.endpoint}/loading`, "_blank", `popup=1,width=420,height=700,top=${top},left=${left}`);
        });
    }
    onRequested(id, request, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.signWindow == null)
                return;
            this.unloadHandler = () => { var _a; return (_a = this.signWindow) === null || _a === void 0 ? void 0 : _a.close(); };
            window.addEventListener("beforeunload", this.unloadHandler);
            this.signWindow.location = `${this.endpoint}/request/${id}`;
            this.timerHandler = setInterval(() => {
                var _a;
                if ((_a = this.signWindow) === null || _a === void 0 ? void 0 : _a.closed)
                    reject("CLOSED");
            }, 1000);
        });
    }
    close() {
        var _a;
        clearInterval(this.timerHandler);
        (_a = this.signWindow) === null || _a === void 0 ? void 0 : _a.close();
        this.signWindow = null;
        if (this.unloadHandler) {
            window.removeEventListener("beforeunload", this.unloadHandler);
        }
    }
    onFailed() {
        return __awaiter(this, void 0, void 0, function* () {
            this.close();
        });
    }
    onSuccess() {
        return __awaiter(this, void 0, void 0, function* () {
            this.close();
        });
    }
}
exports.WindowStrategy = WindowStrategy;
//# sourceMappingURL=WindowStrategy.js.map