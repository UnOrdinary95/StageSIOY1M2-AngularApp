import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { LoginModal } from '../../modals/login-modal/login-modal';
import { RegisterModal } from '../../modals/register-modal/register-modal';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-header',
    imports: [MatDialogModule],
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header {
    constructor(private dialog: MatDialog, private authService: AuthService) { }

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
    }
}
