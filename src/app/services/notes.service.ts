import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Notes } from '../models/Notes';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private notesCollection: AngularFirestoreCollection<Notes>;
  notes: Observable<Notes[]>;

  constructor(
    public _afdb: AngularFireDatabase,
    private _afs: AngularFirestore
  ) {
    this.notesCollection = this._afs.collection<Notes>('notes');
    this.notes = this.notesCollection.valueChanges();
  }

  getNotes() {
    return this.notes;
  }

  getNote(id) {
    return this._afdb.object(`/notes/${id}`);
  }

  createNote(note: Notes) {
    const id = this._afs.createId();
    note.id = id;
    note.createdAt = new Date();
    return this.notesCollection.doc<Notes>(id).set(note);
  }

  updateNote(note: Notes) {
    return this.notesCollection.doc<Notes>(note.id).update(note);
  }

  deleteNote(note: Notes) {
    return this.notesCollection.doc(note.id).delete();
  }
}
