// src/app/services/item.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  id: number;
  name: string;
  quantity: number;
  timestamp: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  // ✅ Use relative URL so Nginx can proxy it
  private apiUrl = '/api/items';

  constructor(private http: HttpClient) {}

  // Get items for the logged-in user
  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  addItem(name: string): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, { name });
  }

  updateItem(id: number, name: string, quantity: number): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${id}`, { name, quantity });
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}