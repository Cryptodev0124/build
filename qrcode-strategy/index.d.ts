import { HereProviderRequest, HereProviderResult } from "../types";
import { HereStrategy } from "../strategies/HereStrategy";
import QRCode, { QRSettings } from "./qrcode";
import logo from "./logo";
export { QRCode, QRSettings, logo };
export interface QRCodeStrategyOptions extends Partial<QRSettings> {
    element: HTMLElement;
    theme?: "dark" | "light";
    animate?: boolean;
    endpoint?: string;
}
export declare class QRCodeStrategy extends HereStrategy {
    options: QRCodeStrategyOptions;
    private qrcode?;
    readonly endpoint: string;
    constructor(options: QRCodeStrategyOptions);
    get themeConfig(): QRSettings;
    onRequested(id: string, request: HereProviderRequest): Promise<void>;
    close(): void;
    onApproving(result: HereProviderResult): Promise<void>;
    onFailed(result: HereProviderResult): Promise<void>;
    onSuccess(result: HereProviderResult): Promise<void>;
}
export declare const darkQR: QRSettings;
export declare const lightQR: QRSettings;
