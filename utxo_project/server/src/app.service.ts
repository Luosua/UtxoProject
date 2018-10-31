import { Injectable } from '@nestjs/common';
import rpn = require('request-promise-native')



@Injectable()
export class AppService {
  private utxo: number [] = new Array();
  private getUTXO(btcAddress:string): number[]{
    
    let options: rpn.Options = {
    // uri: 'https://blockexplorer.com/api/addr/1BdenS1kFEHJwYqjYPxCCNWRoLwc47pueN/utxo',
    uri: 'https://blockexplorer.com/api/addr/'+btcAddress+'/utxo',
    method: 'GET',
    json: true
  };
  rpn(options)
  .then((response) => {
    for (var i = 0; i < response.length; i++) {
      this.utxo.push(response[i].amount);
    }
  })
  .catch(console.error);
  return this.utxo;
  }

  root(btcAddress:string): number[] {
    return this.getUTXO(btcAddress);
  }
}
