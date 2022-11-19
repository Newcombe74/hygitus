import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastComponent } from "../components/toast/toast.component";

@Injectable()
export class ToastService {

  public duration =  3000;
  public horizontalPosition: 'left' | 'start' | 'end' | 'right' | 'center' | undefined = 'center';
  public verticalPosition: 'bottom' | 'top' | undefined = 'bottom';

  constructor(private snackBar: MatSnackBar) { }

  public submitToast(
    message: string,
    duration = this.duration,
    horizontalPosition = this.horizontalPosition,
    verticalPosition = this.verticalPosition
  ) {
    this.snackBar.openFromComponent(ToastComponent, {
      data: message,
      duration,
      horizontalPosition,
      verticalPosition
    });
  }
}