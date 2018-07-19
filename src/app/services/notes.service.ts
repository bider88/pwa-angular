import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Notes } from '../models/Notes';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private notesCollection: AngularFirestoreCollection<Notes>;
  notes: Observable<Notes[]>;
  uid: string;

  constructor(
    public _afdb: AngularFireDatabase,
    private _authService: AuthService,
    private _afs: AngularFirestore
  ) {
    this._authService.user.subscribe(
      res => {
        if (res) {
          this.uid = res.uid;
          // tslint:disable-next-line:max-line-length
          this.notesCollection = this._afs.collection<Notes>('notes', ref => ref.where('user', '==', this.uid).orderBy('createdAt', 'desc'));
          this.notes = this.notesCollection.valueChanges();
        }
      },
      err => console.log(err)
    );
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
    note.user = this.uid;
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
