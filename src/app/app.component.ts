import { Component, OnInit, Inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Category } from './models/Category';
import { Notes } from './models/Notes';
import { NotesService } from './services/notes.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
// tslint:disable-next-line:max-line-length
import { MatSnackBar, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from './services/auth.service';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';
  panelOpenState = false;
  loadAction = false;
  loading = false;
  note: Notes = {title: null, note: null, category: { value: null}};
  notes: Array<Notes> = [];
  message: any = {};

  categories: Category[] = [
    {value: 'Trabajo'},
    {value: 'Personal'}
  ];

  constructor(
    public authService: AuthService,

    private _swUpdate: SwUpdate,
    private _noteService: NotesService,
    private _bottomSheet: MatBottomSheet,
    private _matIconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
    private _messagingService: MessagingService
  ) {
    this._matIconRegistry.addSvgIcon( 'icon_google', this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon-google.svg')
    );
    this._messagingService.receiveMessage();
    this.message = this._messagingService.currentMessage;
  }

  ngOnInit() {
    // Con el if, verificamos si el navegador soporta service worker
    if (this._swUpdate.isEnabled) {
      // con esto el sw avisa cada vez que hay contenido nuevo disponible
      this._swUpdate.available.subscribe(
        () => {
          window.location.reload();
        }
      );
    }
    this.getNotes();
  }

  openBottomSheet(note: Notes): void {
    const bottomSheetRef = this._bottomSheet.open(AppBottomSheet, {
      data: note,
    });

    bottomSheetRef.afterDismissed().subscribe(res => {
      if (res) {
        if (res.edit) {
          // this.note = res.data;
          this.note = {
            title: res.data.title,
            note: res.data.note,
            category: res.data.category,
            createdAt: res.data.createdAt,
            id: res.data.id
          };
          this.panelOpenState = true;
          window.scrollTo(0, 0);
        }
      }
    });
  }

  saveNote() {
    this.loadAction = true;
    if (this.note.id) {
      this._noteService.updateNote(this.note)
        .then(() => {
          this.resetNote();
          this.panelOpenState = false;
          this.showSnackBar('Nota actualizada', 'Aceptar');
          this.loadAction = false;
        })
        .catch(err => {
          console.log(err);
          this.loadAction = false;
        });
    } else {
      this._noteService.createNote(this.note)
        .then(() => {
          this.resetNote();
          this.panelOpenState = false;
          this.showSnackBar('Nota agregada', 'Aceptar');
          this.loadAction = false;
        })
        .catch(err => {
          console.log(err);
          this.loadAction = false;
        });
    }
  }

  getNotes() {
    if (JSON.parse(localStorage.getItem('user'))) {
      if (JSON.parse(localStorage.getItem('user')).uid) {
        this.loading = true;
        this._noteService.getNotes().subscribe(
          res => {
            this.notes = res;
            this.loading = false;
          },
          err => {
            // console.log(err);
            this.loading = false;
          }
        );
      }
    }
  }

  cancel() {
    this.panelOpenState = false;
    this.resetNote();
  }

  async login() {
    await this.authService.login();
    this.getNotes();
  }

  logout() {
    this.authService.logout();
  }

  showSnackBar(message: string = '', action: string = '') {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  resetNote() {
    this.note = {title: null, note: null, category: { value: null}};
  }

}
@Component({
  template: `
    <h4>{{data.title}}</h4>
    <mat-nav-list>
      <a href='#' mat-list-item (click)='handleClick($event, 0)'>
        <span mat-line>Editar nota</span>
      </a>
      <a href='#' mat-list-item (click)='handleClick($event, 1)'>
        <span mat-line>Eliminar nota</span>
      </a>
    </mat-nav-list>
  `
})
// tslint:disable-next-line:component-class-suffix
export class AppBottomSheet {
  constructor(
    private sheet: MatBottomSheetRef,
    public _dialog: MatDialog,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}

  handleClick(event: MouseEvent, option: number) {
    event.preventDefault();

    switch (option) {
      case 0:
        this.sheet.dismiss({edit: true, data: this.data});
      break;
      case 1:
        this._dialog.open(AppDialogOverview, {
          width: '250px',
          data: this.data
        });
        this.sheet.dismiss({edit: false});
      break;
    }
  }
}

@Component({
  template: `
    <h4>¿Estás seguro de eliminar la nota?</h4>
    <div class='d-flex'>
        <button class='full-width' mat-raised-button (click)='onNoClick()'>Cancelar</button>
        <div class='space'></div>
        <button class='full-width' mat-raised-button (click)='onYesClick()'>Eliminar</button>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
// tslint:disable-next-line:component-class-suffix
export class AppDialogOverview {

  constructor(
    public dialogRef: MatDialogRef<AppDialogOverview>,
    private _noteService: NotesService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.deleteNote(this.data);
    this.dialogRef.close();
  }

  deleteNote(note: Notes) {
    this._noteService.deleteNote(note)
    .then(() => {
      this.showSnackBar('Nota eliminada', 'Aceptar');
    })
    .catch(err => {
      console.log(err);
    });
  }

  showSnackBar(message: string = '', action: string = '') {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
