import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { AppModule } from 'app.module';

@Controller()
export class AppController {
  private readonly appModule:AppModule;
  constructor(private readonly appService: AppService) {
    this.appModule = new AppModule();
  }
private getParametersFromUser(): Object{
  
  // var readlineSync = require('readline-sync');
  
  // let address:string = readlineSync.question("Enter the BTC address:");
  // let orderAmount:number = readlineSync.question("Enter the order amount:");
//   const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('What do you think of Node.js? ', (answer) => {
//   // TODO: Log the answer in a database
//   console.log(`Thank you for your valuable feedback: ${answer}`);

//   rl.close();
// });
  return {address:"1NVNdMzKggW9ag67qz5vRZG6dBXt2aeijt", orderAmount:0.45};
}
  @Get()
  root(): string {
    try{
      let parameters:Object = this.getParametersFromUser();
      // let utxo:number[] =  this.appService.root(parameters["address"]);

    let utxo:number []= new Array(0.1, 0.3, 0.6, 0.2, 0.03, 0.04, 0.4, 0.5);

      return this.appModule.findSuitableUtxo(utxo, parameters["orderAmount"]).toString();
    }catch(e){console.log(e);}
    
  }
}
