import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-register-modal',
    imports: [CommonModule],
    templateUrl: './register-modal.html',
    styleUrl: './register-modal.css'
})
export class RegisterModal {
    constructor(private dialogRef: MatDialogRef<RegisterModal>) { }
    closeModal() {
        this.dialogRef.close();
    }
}
