import { HttpClient } from "../base/HttpClient";
import { startAuthentication } from '@simplewebauthn/browser';
export class LoginPasskey {
    private httpClient: HttpClient;
    private userName: string;

    constructor(httpClient: HttpClient, userName: string) {
        this.httpClient = httpClient;
        this.userName = userName;
    }

    public async loginPasskey() {
        try {
            const data = await this.httpClient.loginPassKey({
                userName: this.userName
            });
            let response = await data.json();

            let options = response.data;
            // Start registration with WebAuthn API
            const credential = await startAuthentication(options);

            // Send the credential to backend for verification
            const res = await this.httpClient.verifyLoginPasskey({ credential, userId: options.userId, currentChallenge: options.currentChallenge });
            let responseLoginVerifyRaw = await res.json();
            let responseLoginVerify = responseLoginVerifyRaw.data;


            if (!responseLoginVerify.verificationResult.verified) {
                alert('Login failed.');
                return "Login failed";
            }

            localStorage.setItem('passKeyCredentials', JSON.stringify(responseLoginVerify?.passKeyCredentials));
            localStorage.setItem('credentialRawId', responseLoginVerify?.verificationResult.authInfo.credentialID);

            if (responseLoginVerify?.verificationResult.verified) {
                alert('Login successful');
                return "Login successful";
            } else {
                alert('Login failed.');
                return "Login failed";
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Login error.');
        }
    }

 

}