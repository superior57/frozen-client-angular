import { Component, HostBinding, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { User, UserModel } from '../model';
import { catchError, filter, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import { Reception, ReceptionModel } from 'src/app/common/model';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
  private _selectedReception: Reception;

  user: User = {};
  selectedReception: Reception;
  password = '';
  confirmPassword = '';
  formChecked = false;
  isCollapsed = false;
  passwordGroup: FormGroup;
  confirmPasswordGroup: FormGroup;
  receptions$: Observable<Reception[]>;
  roles: string[] = ['chef-departement', 'encodeur'];

  @HostBinding('class')
  ngClass = '';

  constructor(
    receptionModel: ReceptionModel,
    public users: UserModel,
    private snackBar: MatSnackBar,
    @Optional() private dialog: MatDialogRef<UserCreateComponent>
  ) {
    this.receptions$ = receptionModel.filter({}).pipe(
      filter((r) => !!r),
      take(1)
    );
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.ngClass = this.isCollapsed ? 'collapsed' : '';
  }

  ngOnInit(): void {}

  isEditMode(): boolean {
    return !this.users.isUserCreationMode();
  }

  createUser(form: NgForm): void {
    if (!this.passwordsMatch(form)) {
      this.snackBar.open('Les mots de passes ne corespondent pas', 'OK');
      return;
    }

    this.formChecked = true;
    if (form.valid && this.passwordsMatch(form)) {
      this.users
        .save({
          ...this.user,
          departements: this.selectedReception.departements.map(
            (departement) => ({
              utilisateur: this.user.identifiant,
              departement: departement.id,
            })
          ),
          shadow: { password: this.password },
        })
        .pipe(
          take(1),
          catchError(() => {
            this.snackBar.open(
              "Erreur lors de l'enregistrement. Réessayez",
              'OK'
            );
            return EMPTY;
          })
        )
        .subscribe((user: User) => {
          this.snackBar.open('Utilisateur créé avec succès', 'OK');
          this.dismiss(form);
        });
    }
  }

  resetForm(form: NgForm): void {
    this.formChecked = false;
    form.reset();
  }

  passwordsNotMatching(password: string, passwordCheck: string): boolean {
    return password !== passwordCheck;
  }

  private passwordsMatch(form: NgForm): boolean {
    const password = form.controls.password.value;
    const passwordConfirm = form.controls.confirmPassword.value;
    return password === passwordConfirm;
  }

  dismiss(form: NgForm): void {
    this.users.setIsUserCreationMode(true);
    this.resetForm(form);
    this.dialog.close();
  }
}
