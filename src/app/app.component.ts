import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    private _swUpdate: SwUpdate
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
  }
}
