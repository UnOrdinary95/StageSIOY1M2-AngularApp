import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { LoginModal } from '../../modals/login-modal/login-modal';
import { RegisterModal } from '../../modals/register-modal/register-modal';

@Component({
    selector: 'app-header',
    imports: [MatDialogModule],
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header {
    constructor(private dialog: MatDialog) { }

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
}
