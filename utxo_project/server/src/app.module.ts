import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    private oneBytePrice: number;
    private defaultTransWeight:number;
    private btcToSatoshiCoef:number;
    private extraInputWeight:number;
    private requiredUtxo:number[];

    constructor(){
      this.oneBytePrice = 17;
      this.defaultTransWeight = 255;
      this.btcToSatoshiCoef =  0.00000001;
      this.extraInputWeight = 147;
      this.requiredUtxo = new Array();
    }

    private calculateMinPrice(utxo: number[], orderAmount: number): number{
      let priceInSatoshi:number=this.defaultTransWeight * this.oneBytePrice;
      return priceInSatoshi * this.btcToSatoshiCoef;
    }
    private findTotalBalance(utxo:number[]):number{
      let balance:number=0;
      for(var i=0;i < utxo.length; i++){
        balance+=utxo[i];
      }
      return balance;
    }
    findSuitableUtxo(utxo: number[], orderAmount: number): number[]{
      if(orderAmount<=0){
        throw new Error("Order amount must be larger than 0!");
      }
      // if(this.findTotalBalance(utxo)<orderAmount){
      //   throw new Error("Not enough UTXO for this order!");
      // }
      let btcRequired:number = orderAmount + this.calculateMinPrice(utxo, orderAmount);
      let tempBtcRequired:number = btcRequired;
      let lastBtcRequired:number = btcRequired;
      let difference:number = Number.MAX_VALUE;
      let tempUtxo:number[]=new Array();
      let tempSum:number=0;
      let index:number = -1;

      for (var i = 0; i < utxo.length; i++) {
        if(utxo[i]==btcRequired){
          this.requiredUtxo.length=0;
          this.requiredUtxo.push(utxo[i]);
          return this.requiredUtxo;
        }
        else if(utxo[i]>btcRequired && utxo[i]-btcRequired<difference){
            difference = utxo[i]-btcRequired;
            this.requiredUtxo.length=0;
            this.requiredUtxo.push(utxo[i]);
        }
      }
      utxo.sort();
      for (var i = 0; i < utxo.length; i++){
        tempSum+=utxo[i];
        tempBtcRequired+=this.extraInputWeight * this.oneBytePrice * this.btcToSatoshiCoef;
        tempUtxo.push(utxo[i]);
        if(tempSum==tempBtcRequired){
          return this.requiredUtxo;
        }
        else if(tempSum>tempBtcRequired){
          if(tempSum - tempBtcRequired < difference){
            difference = tempSum - tempBtcRequired;
            this.requiredUtxo = tempUtxo.slice(0, tempUtxo.length);
          }
          break;
        }
        if(utxo[i]>btcRequired){
          index = i;
          break;
        }
      }
      if(tempSum < tempBtcRequired){
        this.requiredUtxo.length = 0;
        this.requiredUtxo.push(utxo[index]);
        return this.requiredUtxo;
      }
      tempUtxo.length = 0;
      tempBtcRequired = btcRequired;
      tempSum=0;
      
      utxo = utxo.filter(el => el < btcRequired);
      
      
      for (var i = 0, j=utxo.length-1; j > i; i++){
        if(i==0){
          tempSum = utxo[j] + utxo[i];
          tempUtxo.push(utxo[j]);
        }
        else{
          tempSum+=utxo[i];
        } 
          tempUtxo.push(utxo[i]);
          tempBtcRequired += this.extraInputWeight * this.oneBytePrice * this.btcToSatoshiCoef;
          if(tempSum == tempBtcRequired){
            return tempUtxo;
          }
          else if(tempSum > tempBtcRequired){
            if(tempSum - tempBtcRequired < difference){
              if(lastBtcRequired==btcRequired || tempBtcRequired<lastBtcRequired){
                lastBtcRequired = tempBtcRequired;
                this.requiredUtxo = tempUtxo.slice(0, tempUtxo.length);
                difference = tempSum - tempBtcRequired;
              }
            }
            i=-1;
            j--;
            tempSum = 0;
            tempUtxo.length=0;
            tempBtcRequired = btcRequired;
          }
      }
      return this.requiredUtxo;
    }
}
