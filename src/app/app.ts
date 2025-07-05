import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Product } from './interfaces/Product';
import { ProductService } from './services/product';
import { AuthService } from './services/auth';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginModal } from './modals/login-modal/login-modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './interfaces/User';
import { ProductModal } from './modals/product-modal/product-modal';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer, CurrencyPipe],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App implements OnInit {
    products: Product[] = [];
    currentUser: User | null = null;
    @ViewChild(Header) headerComponent!: Header;

    constructor(private productService: ProductService, private authService: AuthService, private dialog: MatDialog, private http: HttpClient) { }

    ngOnInit(): void {
        this.productService.getAllProducts().subscribe({
            next: (data) => this.products = data,
            error: (err) => console.error('Erreur chargement produits', err)
        });

        this.loadCurrentUser();
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

    isInCart(productId: string): boolean {
        return this.currentUser?.cart.some(item => item.productId === productId) || false;
    }

    isInWishlist(productId: string): boolean {
        return this.currentUser?.wishlist.some(item => item.productId === productId) || false;
    }

    addToCart(idProduct: string): void {
        if (!this.authService.isLoggedIn()) {
            console.error('Utilisateur non connecté, impossible d\'ajouter au panier');
            this.openLoginModal();
            return;
        }

        const tokenValue = this.authService.getTokenDecoded();
        const token = this.authService.getToken();

        if (tokenValue && token) {
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`
            });

            this.http.patch<User>(`http://localhost:3000/users/${tokenValue.userId}/cart`, { productId: idProduct }, { headers }).subscribe({
                next: (user: User) => {
                    console.log('Produit ajouté au panier:', idProduct);
                    this.loadCurrentUser();
                    // Mettre à jour le compteur du panier dans le header
                    this.headerComponent.refreshUserData();
                },
                error: (err) => {
                    console.error('Erreur ajout produit au panier', err);
                }
            });
        }
    }

    addToWishlist(idProduct: string): void {
        if (!this.authService.isLoggedIn()) {
            console.error('Utilisateur non connecté, impossible d\'ajouter au panier');
            this.openLoginModal();
            return;
        }

        const tokenValue = this.authService.getTokenDecoded();
        const token = this.authService.getToken();

        if (tokenValue && token) {
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`
            });

            this.http.patch<User>(`http://localhost:3000/users/${tokenValue.userId}/wishlist`, { productId: idProduct }, { headers }).subscribe({
                next: (user: User) => {
                    console.log('Produit ajouté au panier:', idProduct);
                    this.loadCurrentUser();
                    // Mettre à jour le compteur du panier dans le header (au cas où la wishlist affecterait le panier)
                    this.headerComponent.refreshUserData();
                },
                error: (err) => {
                    console.error('Erreur ajout produit au panier', err);
                }
            });
        }
    }

    openLoginModal() {
        this.dialog.open(LoginModal, {
            width: '800px',
        });
    }

    openProductModal(product: Product) {
        if (!this.authService.isLoggedIn()) {
            console.error('Utilisateur non connecté, impossible d\'ouvrir le modal produit');
            this.openLoginModal();
            return;
        }

        const dialogRef = this.dialog.open(ProductModal, {
            width: '1200px',
            data: product
        });

        // Écouter la fermeture du modal et recharger les données utilisateur si nécessaire
        dialogRef.afterClosed().subscribe(result => {
            if (result === true || result === 'cart_updated') {
                // Le modal a indiqué qu'une mise à jour a eu lieu
                this.loadCurrentUser();
                // Mettre à jour spécifiquement le compteur du panier
                if (result === 'cart_updated') {
                    this.headerComponent.refreshUserData();
                }
            }
        });
    }
}
