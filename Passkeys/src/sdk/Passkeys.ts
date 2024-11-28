import { HttpClient } from './base';
import { SdkParams } from "./interfaces";
import { LoginPasskey } from './PasskeyFlow';
import { RegisterPasskey } from "./PasskeyFlow";
import { ByzanlinkPasskeyProvider } from "./providers";

/**
 *
 * This class is used to initialize the sdk with the wallet provider
 * This will Instanstiate the wallet provider and connect to Byzanlink Wallet
 *
 * @export
 * @class ByzanlinkAAAuth    
 */
export class ByzanlinkAAPasskeys {

    private passkeyServerUrl: string;
    private passkeyUserName: string;
    private passkeyApiKey?: string;
    private passkeyProvider: ByzanlinkPasskeyProvider;
    private registerPasskey: RegisterPasskey;
    private loginPasskey: LoginPasskey;


    constructor(sdkParameters: SdkParams) {
        this.passkeyServerUrl = sdkParameters.passkeyServerUrl;
        this.passkeyUserName = sdkParameters.passkeyUserName;
        this.passkeyProvider = new ByzanlinkPasskeyProvider(this.passkeyServerUrl, this.passkeyApiKey);
        let httpClient: HttpClient = new HttpClient(this.passkeyProvider.url);
        let registerPasskey = new RegisterPasskey(httpClient, this.passkeyUserName);
        let loginPasskey = new LoginPasskey(httpClient, this.passkeyUserName);
        this.registerPasskey = registerPasskey;
        this.loginPasskey = loginPasskey;

    }

    async init(): Promise<boolean> {
        let publicKeyRaw = localStorage.getItem('passKeyCredentials') || '';
        let rawId = localStorage.getItem('credentialRawId') || '';
        if (publicKeyRaw && rawId) {
            return true;
        }
        let response: string = await this.registerPasskey.registerPasskey();
        if (response == "Already Registered") {
            let response: string = await this.loginPasskey.loginPasskey();
            if (response == "Login successful") {
                return true;
            }
            else {
                return false;
            }
        }
        else if (response == "Registration successful") {

            return true;
        }
        else {
            return false;
        }
    }


}