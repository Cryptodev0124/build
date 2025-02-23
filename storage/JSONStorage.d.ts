export interface HereJsonStorage {
    setState(network: string, state: AuthState): Promise<void>;
    getFullState(): Promise<Record<string, AuthState>>;
    getState(network: string): Promise<AuthState>;
    clear(): Promise<void>;
}
export interface AuthState {
    activeAccount: string | null;
    accounts: Record<string, string>;
}
export declare class StateStorage implements HereJsonStorage {
    private readonly dataKey;
    private readonly storage;
    constructor();
    setState(network: string, state: AuthState): Promise<void>;
    getFullState(): Promise<Record<string, AuthState>>;
    getState(network: string): Promise<AuthState>;
    clear(): Promise<void>;
}
