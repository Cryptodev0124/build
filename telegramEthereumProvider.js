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
exports.hereWalletProvider = void 0;
const uuid4_1 = __importDefault(require("uuid4"));
const waitInjected_1 = require("./helpers/waitInjected");
const promises = {};
const request = (type, args) => {
    return new Promise((resolve, reject) => {
        const id = (0, uuid4_1.default)();
        window === null || window === void 0 ? void 0 : window.parent.postMessage({ type, id, args }, "*");
        promises[id] = { resolve, reject };
    });
};
const hereWalletProvider = {
    on() { },
    isHereWallet: true,
    isConnected: () => true,
    request: (data) => request("ethereum", data),
};
exports.hereWalletProvider = hereWalletProvider;
function announceProvider() {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof window === "undefined")
            return;
        const injected = yield waitInjected_1.waitInjectedHereWallet;
        if (injected == null)
            return;
        window === null || window === void 0 ? void 0 : window.dispatchEvent(new CustomEvent("eip6963:announceProvider", {
            detail: Object.freeze({
                provider: hereWalletProvider,
                info: {
                    uuid: (0, uuid4_1.default)(),
                    name: "HERE Wallet",
                    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTUwIiBoZWlnaHQ9IjU1MCIgdmlld0JveD0iMCAwIDU1MCA1NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1NTAiIGhlaWdodD0iNTUwIiByeD0iMTIwIiBmaWxsPSIjRjNFQkVBIj48L3JlY3Q+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjcyLjA0NiAxODMuNTM4TDI5My43ODggMTQzTDMyMi4yODggMjM4LjVMMjc5LjU1OCAyMTkuMTgyTDI3Mi4wNDYgMTgzLjUzOFpNMTE4LjI4OCAyMjZMOTYuMTg0IDI2NS44NTdMMTYzLjc2OSAyOTguOTJMMjU2Ljc4OCAyOTIuNUwxMTguMjg4IDIyNlpNMTA1Ljk2OSAzMDEuMTU4TDg0IDM0MC44MDNMMjE4LjkzNyA0MDcuNzkxTDQ0My44MDcgMzk0LjE0MUw0NjUuNzc2IDM1NC40OTZMMjQwLjkwNiAzNjguMTQ3TDEwNS45NjkgMzAxLjE1OFoiIGZpbGw9IiMyQzMwMzQiPjwvcGF0aD4KPHBhdGggZD0iTTQ2NS43ODggMzU0LjVMMjQwLjk4MiAzNjguMTUzTDEwNC44ODcgMzAxLjAwNUwyNTIuMjU5IDI5Mi4wODhMMTE4LjI4OCAyMjZMMTg0LjA3NiAxNzAuMjgyTDMyMC41NDcgMjM3LjM5N0wyOTMuNzg5IDE0My4wMDFMNDI0LjE5NSAyMDYuOTQ5TDQ2NS43ODggMzU0LjVaIiBmaWxsPSIjRkRCRjFDIj48L3BhdGg+Cjwvc3ZnPg==",
                    rdns: "app.herewallet.my",
                },
            }),
        }));
    });
}
if (typeof window !== "undefined") {
    window === null || window === void 0 ? void 0 : window.addEventListener("message", (e) => {
        var _a, _b;
        if (e.data.type !== "ethereum")
            return;
        if (e.data.isSuccess)
            return (_a = promises[e.data.id]) === null || _a === void 0 ? void 0 : _a.resolve(e.data.result);
        (_b = promises[e.data.id]) === null || _b === void 0 ? void 0 : _b.reject(e.data.result);
    });
    window === null || window === void 0 ? void 0 : window.addEventListener("eip6963:requestProvider", () => announceProvider());
    announceProvider();
}
//# sourceMappingURL=telegramEthereumProvider.js.map