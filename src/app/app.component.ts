import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Category } from './models/Category';
import { Notes } from './models/Notes';
import { NotesService } from './services/notes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  panelOpenState = false;
  note: Notes = {title: null, note: null, category: { value: null}};
  notes: Array<Notes> = [];

  categories: Category[] = [
    {value: 'Trabajo'},
    {value: 'Personal'}
  ];

  constructor(
    private _swUpdate: SwUpdate,
    private _noteService: NotesService
  ) {}

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

  saveNote() {
    this._noteService.createNote(this.note)
      .then(() => {
        this._noteService.getNotes().subscribe(
          () => {
            this.getNotes();
          },
          err => console.log(err)
        );
      })
      .catch(err => console.log(err));
  }

  getNotes() {
    this._noteService.getNotes().subscribe(
      res => {
        this.notes = res;
      },
      err => console.log(err)
    );
  }
}
