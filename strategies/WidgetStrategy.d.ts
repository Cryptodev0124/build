import { HereProviderRequest, HereProviderResult } from "../types";
import { HereStrategy } from "./HereStrategy";
export declare const defaultUrl = "https://my.herewallet.app/connector/index.html";
export declare class WidgetStrategy extends HereStrategy {
    private static connector?;
    private static isLoaded;
    private messageHandler?;
    readonly options: {
        lazy: boolean;
        widget: string;
    };
    constructor(options?: string | {
        lazy?: boolean;
        widget?: string;
    });
    initIframe(): HTMLIFrameElement;
    onRequested(id: string, request: HereProviderRequest, reject: (p?: string) => void): Promise<void>;
    postMessage(data: object): void;
    onApproving(): Promise<void>;
    onSuccess(request: HereProviderResult): Promise<void>;
    onFailed(request: HereProviderResult): Promise<void>;
    close(): void;
}
