
export class HttpClient {

    private readonly url: any;
    constructor(url: string) {
        this.url = url;
    }

    public  appendPathToUrl = (url: string, path: string): string => {
        try {
            const urlObj = new URL(url); // Parse the URL
            // Append the new path to the existing pathname
            urlObj.pathname = `${urlObj.pathname.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
            return urlObj.toString(); // Convert back to string
        } catch (error) {
            console.error("Invalid URL:", error);
            return null; // Handle invalid URL error
        }
    }

    public async registerPasskey(userName: any){

        return await fetch(this.appendPathToUrl(this.url, 'register'), {
            method: 'POST',
            body: JSON.stringify(userName),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public verifyRegisteredPasskey(credential: any): Promise<any> {

        return fetch(this.appendPathToUrl(this.url, 'verifyRegistration'), {
            method: 'POST',
            body: JSON.stringify(credential),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public loginPassKey(userName: any): Promise<any> {

        return  fetch(this.appendPathToUrl(this.url, 'login'), {
            method: 'POST',
            body: JSON.stringify(userName),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public verifyLoginPasskey(credential: any): Promise<any> {

        return fetch(this.appendPathToUrl(this.url, 'verifyLogin'), {
            method: 'POST',
            body: JSON.stringify(credential),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}   