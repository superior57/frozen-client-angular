import { NgModule } from '@angular/core';
import { CommonModule } from '../common';
import { UsersComponent } from './users.component';
import { MaterialModule, MdcModule } from '../material';
import { ModelModule } from './model';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicesModule } from 'src/app/services';
import { UserListActionsComponent } from './user-list-actions/user-list-actions.component';
import { UserRoleEditorComponent } from './user-role-editor/user-role-editor.component';

@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    UserCreateComponent,
    UserListActionsComponent,
    UserRoleEditorComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MdcModule,
    CommonModule,
    ModelModule,
    FormsModule,
    ServicesModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}
