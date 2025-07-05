import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../services/product';
import { AuthService } from '../../services/auth';
import { Product } from '../../interfaces/Product';
import { User } from '../../interfaces/User';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-product-modal',
    imports: [CommonModule, FormsModule, CurrencyPipe],
    templateUrl: './product-modal.html',
    styleUrl: './product-modal.css'
})
export class ProductModal {
    currentUser: User | null = null;
    private hasUpdated = false; // Track si des modifications ont été faites

    constructor(
        private dialogRef: MatDialogRef<ProductModal>,
        private productService: ProductService,
        private authService: AuthService,
        private http: HttpClient,
        @Inject(MAT_DIALOG_DATA) public product: Product
    ) {
        this.loadCurrentUser();
    }

    closeModal() {
        this.dialogRef.close(this.hasUpdated); // Passe true si des modifications ont été faites
    }

    closeWithUpdate() {
        this.dialogRef.close(true); // Indique qu'une mise à jour a eu lieu
    }

    loadCurrentUser(): void {
        if (this.authService.isLoggedIn()) {
            const tokenValue = this.authService.getTokenDecoded();
            const token = this.authService.getToken();

            if (tokenValue && token) {
                const headers = new HttpHeaders({
                    'Authorization': `Bearer ${token}`
                });

                this.http.get<User>(`http://localhost:3000/users/${tokenValue.userId}`, { headers }).subscribe({
                    next: (user: User) => {
                        this.currentUser = user;
                    },
                    error: (err) => {
                        console.error('Erreur chargement utilisateur', err);
                    }
                });
            }
        }
    }

    isInCart(): boolean {
        return this.currentUser?.cart.some(item => item.productId === this.product._id.toString()) || false;
    }

    isInWishlist(): boolean {
        return this.currentUser?.wishlist.some(item => item.productId === this.product._id.toString()) || false;
    }

    addToCart(): void {
        if (!this.authService.isLoggedIn()) {
            console.error('Utilisateur non connecté, impossible d\'ajouter au panier');
            return;
        }

        const tokenValue = this.authService.getTokenDecoded();
        const token = this.authService.getToken();

        if (tokenValue && token) {
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`
            });

            this.http.patch<User>(`http://localhost:3000/users/${tokenValue.userId}/cart`, { productId: this.product._id.toString() }, { headers }).subscribe({
                next: (user: User) => {
                    console.log('Produit ajouté au panier:', this.product._id);
                    this.loadCurrentUser();
                    this.hasUpdated = true; // Marquer qu'une modification a été faite
                    this.dialogRef.close('cart_updated'); // Indiquer spécifiquement que le panier a été mis à jour
                },
                error: (err) => {
                    console.error('Erreur ajout produit au panier', err);
                }
            });
        }
    }

    addToWishlist(): void {
        if (!this.authService.isLoggedIn()) {
            console.error('Utilisateur non connecté, impossible d\'ajouter à la wishlist');
            return;
        }

        const tokenValue = this.authService.getTokenDecoded();
        const token = this.authService.getToken();

        if (tokenValue && token) {
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`
            });

            this.http.patch<User>(`http://localhost:3000/users/${tokenValue.userId}/wishlist`, { productId: this.product._id.toString() }, { headers }).subscribe({
                next: (user: User) => {
                    console.log('Produit ajouté à la wishlist:', this.product._id);
                    this.loadCurrentUser();
                    this.hasUpdated = true; // Marquer qu'une modification a été faite
                },
                error: (err) => {
                    console.error('Erreur ajout produit à la wishlist', err);
                }
            });
        }
    }

    get getAllProducts() {
        return this.productService.getAllProducts();
    }
}
