export class ApiService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async list(params?: Record<string, any>): Promise<T[]> {
    const url = new URL(import.meta.env.VITE_API_BASE_URL + this.endpoint);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

    const res = await fetch(url.toString());
    if (!res.ok) throw await this.handleError(res);
    return res.json();
  }

  async get(id: number): Promise<T> {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${this.endpoint}/${id}`);
    if (!res.ok) throw await this.handleError(res);
    return res.json();
  }

  async create(data: Partial<T>): Promise<T> {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${this.endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await this.handleError(res);
    return res.json();
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${this.endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await this.handleError(res);
    return res.json();
  }

  async delete(id: number): Promise<void> {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${this.endpoint}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw await this.handleError(res);
  }

  private async handleError(res: Response) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, ...err };
  }
}
