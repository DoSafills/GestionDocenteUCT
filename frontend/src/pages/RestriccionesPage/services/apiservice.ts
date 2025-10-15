export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async request(
    method: string,
    endpoint: string,
    data?: any,
    token?: string
  ): Promise<any | null> {
    const headers: HeadersInit = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return response.status !== 204 ? await response.json() : null;
  }

  protected get(endpoint = "", token?: string) {
    return this.request("GET", endpoint, undefined, token);
  }

  protected post(endpoint = "", data?: any, token?: string) {
    return this.request("POST", endpoint, data, token);
  }

  protected put(endpoint = "", data?: any, token?: string) {
    return this.request("PUT", endpoint, data, token);
  }

  protected patch(endpoint = "", data?: any, token?: string) {
    return this.request("PATCH", endpoint, data, token);
  }

  protected delete(endpoint = "", token?: string) {
    return this.request("DELETE", endpoint, undefined, token);
  }
}
