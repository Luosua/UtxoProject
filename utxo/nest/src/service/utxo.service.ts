import { Injectable } from '@nestjs/common';
import rpn = require('request-promise-native');
import { defaultTransWeight, oneBytePrice, btcToSatoshiCoef, extraInputWeight } from 'keys';

@Injectable()
export class UtxoService {

    private calculateMinPrice(): number {
        const priceInSatoshi: number = defaultTransWeight * oneBytePrice;
        return priceInSatoshi * btcToSatoshiCoef;
    }
    public findTotalBalance(utxo: number[]): number {
        let balance:number=0;
        for(var i=0;i < utxo.length; i++){
            balance+=utxo[i];
        };
        return balance;
    }

    findSuitableUtxo(utxo: number[], orderAmount: number): number[] {
        let requiredUtxo:number[] = new Array();
        let btcRequired:number = +orderAmount + this.calculateMinPrice();
        let tempBtcRequired:number = btcRequired;
        let difference:number = Number.MAX_VALUE;
        let tempSum:number=0;
        //check if one of the UTXO equals btc required
        for (var i = 0; i < utxo.length; i++) {
          if(utxo[i]==btcRequired){
            requiredUtxo.length=0;
            requiredUtxo.push(utxo[i]);
            return requiredUtxo;
          }
          //check if a new difference between one of the UTXO and required value is smaller than the last one
          else if(utxo[i]>btcRequired && utxo[i]-btcRequired<difference){
            // console.log("btcRequired " + btcRequired);
            // console.log("orderAmount " + orderAmount);
            difference = utxo[i]-btcRequired;
            requiredUtxo.length=0;
            requiredUtxo.push(utxo[i]);
          }
        }
        //if there is any UTXO bigger than the required amount, return it
        if(requiredUtxo.length !=0){
          //console.log(requiredUtxo);
          return requiredUtxo;
        }
        //sort UTXO to sum up values that are smaller than the required one
        utxo.sort();    
        tempSum = utxo[utxo.length-1];
        tempBtcRequired += extraInputWeight * oneBytePrice * btcToSatoshiCoef;
        //this loop goes through the sorted UTXO list and sums up at first the smallest and the greatest UTXO,
        //then the other UTXO from the second smallest one
        console.log(utxo);
        for (var i = 0; i < utxo.length - 1; i++){
            if(tempSum + utxo[i] >= tempBtcRequired){
            tempSum += utxo[i];
            requiredUtxo.push(utxo[utxo.length-1]);
            requiredUtxo.push(utxo[i]);
            return requiredUtxo.sort();
        }
    }
    
    requiredUtxo.push(utxo[utxo.length-1]);
    console.log(requiredUtxo);
    
    for (var i = utxo.length - 2; i >= 0; i--){
        console.log("first " + tempSum);
        console.log("utxo " + utxo[i]);
        tempSum += utxo[i];
        console.log("second " + tempSum);
          requiredUtxo.push(utxo[i]);
          if(tempSum >= tempBtcRequired){
            //console.log(requiredUtxo);
            return requiredUtxo.sort();
          }
          tempBtcRequired += extraInputWeight * oneBytePrice * btcToSatoshiCoef;
        }
    }

    async getUTXO(btcAddress: string, orderValue: number): Promise<number[]> {
        const options = {
            method: 'get',
            uri: 'https://chain.so/api/v2/get_tx_unspent/btctest/' + btcAddress,
            json: true,
        };
        const response = await rpn(options);

        const data = response.data['txs'].map(t => +t.value);
        return this.findSuitableUtxo(data, orderValue);
    }
}
