import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-login-modal',
    imports: [CommonModule],
    templateUrl: './login-modal.html',
    styleUrl: './login-modal.css'
})
export class LoginModal {
    constructor(private dialogRef: MatDialogRef<LoginModal>) { }
    closeModal() {
        this.dialogRef.close();
    }
}
