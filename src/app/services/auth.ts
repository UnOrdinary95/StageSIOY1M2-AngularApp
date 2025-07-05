import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../interfaces/TokenPayload';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'token';

    isLoggedIn(): boolean {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    login(token: string) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    getTokenDecoded() {
        const token = this.getToken();
        if (!token) {
            return null;
        }
        try {
            return jwtDecode<TokenPayload>(token);
        } catch (error) {
            console.error('Invalid token', error);
            return null;
        }
    }

}
