import { HttpClient } from "../base/HttpClient";
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

export class RegisterPasskey {
    private httpClient: HttpClient;
    private userName: string;

    constructor(httpClient: HttpClient,userName: string) {
        this.httpClient = httpClient;
        this.userName = userName;
    }

    public async registerPasskey() {

        try {
            const data = await this.httpClient.registerPasskey({
                userName: this.userName
              });
              let response = await data.json();
            let options = response.options;
            // Start registration with WebAuthn API
            if (options.message == 'Already Registered') {
              alert('Already Registered');
              return "Already Registered";
            }
            const credential = await startRegistration(options);
  
            const res = await this.httpClient.verifyRegisteredPasskey({ credential, userId: options.userId, currentChallenge: options.currentChallenge });
            let response1 = await res.json();
            if (response1.verificationResult.verified) {
              alert('Registration successful!');
             return "Registration successful";
            } else {
              alert('Registration failed.');
            }
          } catch (error) {
            console.error('Error during registration:', error);
            alert('Registration error.');
          }
    }
}