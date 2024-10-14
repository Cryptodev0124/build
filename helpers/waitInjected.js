"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitInjectedHereWallet = void 0;
exports.waitInjectedHereWallet = new Promise((resolve) => {
    if (typeof window === "undefined")
        return resolve(null);
    if ((window === null || window === void 0 ? void 0 : window.self) === (window === null || window === void 0 ? void 0 : window.top))
        return resolve(null);
    const handler = (e) => {
        if (e.data.type !== "here-wallet-injected")
            return;
        window === null || window === void 0 ? void 0 : window.parent.postMessage("here-sdk-init", "*");
        window === null || window === void 0 ? void 0 : window.removeEventListener("message", handler);
        resolve({
            ethAddress: e.data.ethAddress,
            accountId: e.data.accountId,
            publicKey: e.data.publicKey,
            telegramId: e.data.telegramId,
            network: e.data.network || "mainnet",
        });
    };
    window === null || window === void 0 ? void 0 : window.addEventListener("message", handler);
    setTimeout(() => resolve(null), 2000);
});
//# sourceMappingURL=waitInjected.js.map