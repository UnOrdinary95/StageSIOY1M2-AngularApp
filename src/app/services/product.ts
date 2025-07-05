import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/Product';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private apiUrl = 'http://localhost:3000/products'; // adapte selon ton backend

    constructor(private http: HttpClient) { }

    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }
}
