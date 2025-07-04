import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-login-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './login-modal.html',
    styleUrl: './login-modal.css'
})
export class LoginModal {
    email = '';
    password = '';
    constructor(private dialogRef: MatDialogRef<LoginModal>, private http: HttpClient, private authService: AuthService) { }
    closeModal() {
        this.dialogRef.close();
    }

    private login(token: string) {
        this.authService.login(token);
    }

    onSubmit() {
        const registerData = {
            email: this.email,
            password: this.password
        };

        this.http.post('http://localhost:3000/login', registerData).subscribe({
            next: (res: any) => {
                console.log("Connexion réussie", res);
                this.login(res.token);
                this.dialogRef.close();
            },
            error: (err) => {
                console.log("Erreur lors de la connexion", err);
                alert("Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
            }
        });
    }
}
