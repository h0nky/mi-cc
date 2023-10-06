import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mi-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent {
  constructor(private dialogRef: MatDialogRef<DeleteConfirmationComponent>) { }

  confirmDelete() {
    this.dialogRef.close(true);
  }

  cancelDelete() {
    this.dialogRef.close(false);
  }
}
