import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { LoginModal } from '../../modals/login-modal/login-modal';
import { RegisterModal } from '../../modals/register-modal/register-modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { User } from '../../interfaces/User';

@Component({
    selector: 'app-header',
    imports: [MatDialogModule],
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header {
    private currentUser: User | null = null;

    constructor(private dialog: MatDialog, private authService: AuthService, private http: HttpClient) { }

    openLoginModal() {
        this.dialog.open(LoginModal, {
            width: '800px',
        });
    }

    openRegisterModal() {
        this.dialog.open(RegisterModal, {
            width: '800px',
        });
    }

    get isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    logout() {
        this.authService.logout();
        window.location.reload();
    }

    getCurrentUser(): User | null {
        const tokenValue = this.authService.getTokenDecoded();
        const token = this.authService.getToken();

        if (tokenValue && token) {
            if (!this.currentUser) {
                const headers = new HttpHeaders({
                    'Authorization': `Bearer ${token}`
                });

                this.http.get<User>(`http://localhost:3000/users/${tokenValue.userId}`, { headers }).subscribe({
                    next: (user: User) => {
                        console.log("Utilisateur actuel:", user);
                        this.currentUser = user;
                    },
                    error: (err) => {
                        console.error("Erreur lors de la récupération de l'utilisateur actuel", err);
                        this.currentUser = null;
                    }
                });
            }
            return this.currentUser;
        }
        return null;
    }

    getCartItemCount(): number {
        const user = this.getCurrentUser();
        console.log("Nombre d'articles dans le panier:", user?.cart.length || 0);
        return user?.cart.length || 0;
    }
}
