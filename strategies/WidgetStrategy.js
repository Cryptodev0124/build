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
exports.WidgetStrategy = exports.defaultUrl = void 0;
const HereStrategy_1 = require("./HereStrategy");
const createIframe = (widget) => {
    const connector = document.createElement("iframe");
    connector.src = widget;
    connector.allow = "usb";
    connector.style.border = "none";
    connector.style.zIndex = "10000";
    connector.style.position = "fixed";
    connector.style.display = "none";
    connector.style.top = "0";
    connector.style.left = "0";
    connector.style.width = "100%";
    connector.style.height = "100%";
    document.body.appendChild(connector);
    return connector;
};
exports.defaultUrl = "https://my.herewallet.app/connector/index.html";
class WidgetStrategy extends HereStrategy_1.HereStrategy {
    constructor(options = { widget: exports.defaultUrl, lazy: false }) {
        super();
        this.options = {
            lazy: typeof options === "object" ? options.lazy || false : false,
            widget: typeof options === "string" ? options : options.widget || exports.defaultUrl,
        };
        if (!this.options.lazy) {
            this.initIframe();
        }
    }
    initIframe() {
        if (WidgetStrategy.connector == null) {
            WidgetStrategy.connector = createIframe(this.options.widget);
            WidgetStrategy.connector.addEventListener("load", () => {
                WidgetStrategy.isLoaded = true;
            });
        }
        return WidgetStrategy.connector;
    }
    onRequested(id, request, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            const iframe = this.initIframe();
            iframe.style.display = "block";
            const loadHandler = () => {
                var _a, _b, _c;
                (_a = WidgetStrategy.connector) === null || _a === void 0 ? void 0 : _a.removeEventListener("load", loadHandler);
                (_c = (_b = WidgetStrategy.connector) === null || _b === void 0 ? void 0 : _b.contentWindow) === null || _c === void 0 ? void 0 : _c.postMessage(JSON.stringify({ type: "request", payload: { id, request } }), new URL(this.options.widget).origin);
            };
            if (WidgetStrategy.isLoaded)
                loadHandler();
            else
                iframe.addEventListener("load", loadHandler);
            this.messageHandler = (event) => {
                try {
                    if (event.origin !== new URL(this.options.widget).origin)
                        return;
                    if (JSON.parse(event.data).type === "reject")
                        reject();
                }
                catch (_a) { }
            };
            window === null || window === void 0 ? void 0 : window.addEventListener("message", this.messageHandler);
        });
    }
    postMessage(data) {
        var _a;
        const iframe = this.initIframe();
        const args = JSON.stringify(data);
        const origin = new URL(this.options.widget).origin;
        (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage(args, origin);
    }
    onApproving() {
        return __awaiter(this, void 0, void 0, function* () {
            this.postMessage({ type: "approving" });
        });
    }
    onSuccess(request) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request);
            this.postMessage({ type: "result", payload: { request } });
            this.close();
        });
    }
    onFailed(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.postMessage({ type: "result", payload: { request } });
            this.close();
        });
    }
    close() {
        if (this.messageHandler) {
            window === null || window === void 0 ? void 0 : window.removeEventListener("message", this.messageHandler);
            this.messageHandler = undefined;
        }
        if (WidgetStrategy.connector) {
            WidgetStrategy.connector.style.display = "none";
        }
    }
}
exports.WidgetStrategy = WidgetStrategy;
WidgetStrategy.isLoaded = false;
//# sourceMappingURL=WidgetStrategy.js.map