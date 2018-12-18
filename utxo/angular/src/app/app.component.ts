import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { HttpClient} from '@angular/common/http';

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import {Utxo} from "./utxo"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent {
  btcAddress = '';
  orderValue = "g";
  utxoUrl="localhost:3000/utxo";
  utxo: Utxo[];
  statusCode: number;

  constructor(private http:HttpClient){}
  getUtxo(){
    this.http.get(this.utxoUrl).subscribe(
      //data => this.utxo = data
    );
  }
 
}
