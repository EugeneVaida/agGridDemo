import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  configUrl = "https://529badaa441e.ngrok.io/api/data/get";

  getData() {    
    return fromFetch(this.configUrl).pipe(
      switchMap(response => {
        if (response.ok) {
          // OK return data
          return response.json();
        } else {
          // Server is returning a status requiring the client to try something else.
          return of({ error: true, message: `Error ${response.status}` });
        }
      }),
      catchError(err => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({ error: true, message: err.message })
      })
    );
    return null;
  }

  searchBy(string){
    return fromFetch(`${this.configUrl}?searchByText=${string}`).pipe(
      switchMap(response => {
        if (response.ok) {
          // OK return data
          return response.json();
        } else {
          // Server is returning a status requiring the client to try something else.
          return of({ error: true, message: `Error ${response.status}` });
        }
      }),
      catchError(err => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({ error: true, message: err.message })
      })
    );
  }

  update(object){
    console.log(object);
    return this.http.put('https://529badaa441e.ngrok.io/api/data/update', object);
  }

  delete(id){
    return this.http.delete(`https://529badaa441e.ngrok.io/api/data/delete?id=${id}`);
  }
  
}
