import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-register-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './register-modal.html',
    styleUrl: './register-modal.css'
})
export class RegisterModal {
    name = '';
    email = '';
    password = '';
    constructor(private dialogRef: MatDialogRef<RegisterModal>, private http: HttpClient) { }
    closeModal() {
        this.dialogRef.close();
    }

    onSubmit() {
        const registerData = {
            name: this.name,
            email: this.email,
            password: this.password
        };

        console.log("Données envoyées :", registerData);


        this.http.post('http://localhost:3000/register', registerData).subscribe({
            next: (res) => {
                console.log("Inscription réussie", res);
                this.dialogRef.close();
            },
            error: (err) => {
                console.log("Erreur lors de l'inscription", err);
            }
        });
    }
}
