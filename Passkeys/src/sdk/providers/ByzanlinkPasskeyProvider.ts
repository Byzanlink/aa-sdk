
export class ByzanlinkPasskeyProvider  {
  readonly url: string;
  readonly apiKey: string;

  constructor(passkeyUrl:string, apiKey: string) {
    if (apiKey) {
      if (passkeyUrl.includes('?apiKey=')) this.url = passkeyUrl + apiKey;
      else this.url = passkeyUrl + '?apiKey=' + apiKey;
    }
    else this.url = passkeyUrl;

    this.apiKey = apiKey;
  }
}