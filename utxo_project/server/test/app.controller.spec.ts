import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppModule } from './app.module'

describe('AppController', () => {
  let app: TestingModule;
  const module = new AppModule();
 
  let utxoFirst:number []= new Array(0.1, 0.3, 0.2, 5.0, 0.0001, 1.2, 0.03, 0.04, 0.4, 6.3, 0.00001);
  let utxoSecond:number []= new Array(0.9, 0.03, 75.0, 0.00004, 3.07, 5.0, 0.00001, 1.2);
  
  // it('should return "Hello World!"', () => {
  //     const appController = app.get<AppController>(AppController);
  //     expect(appController.root()).toBe('Hello World!');
  //   });
  // });
  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });
  describe('one of the UTXO equals orderValue', () => {
      describe.each([
        [utxoFirst, 0.00001, [0.0001]], 
        [utxoFirst, 1.2, [0.0001, 1.2]], 
        [utxoFirst, 5.0, [0.0001, 5.0]],
        [utxoSecond, 0.00001, [0.03]], 
        [utxoSecond, 1.2, [0.03, 1.2]], 
        [utxoSecond, 5.0, [0.03, 5]],
      ])('.findSuitableUtxo(%o, %i, %i)', (utxo, orderValue, expected) => {
         test('', () => {
            expect(module.findSuitableUtxo(utxo, orderValue)).toEqual(expected);
         });
     })
      });

      describe('one of the UTXO equals required BTC value', () => {
        describe.each([
          [[0.1, 0.3, 0.2, 5.0, 0.0001, 1.2, 0.03, 0.04, 0.4, 6.3, 0.00001, 0.00005335], 0.00001, [0.00005335]], 
          [[0.1, 0.3, 0.2, 5.0, 0.0001, 1.2, 0.03, 0.04, 0.4, 6.3, 0.00001, 1.20004335], 1.2, [1.20004335]], 
          [[0.9, 0.03, 75.0, 0.00004, 3.07, 5.0, 0.00001, 1.2, 5.00004335], 5.0, [5.00004335]],
        ])('.findSuitableUtxo(%o, %i, %i)', (utxo, orderValue, expected) => {
           test('', () => {
              expect(module.findSuitableUtxo(utxo, orderValue)).toEqual(expected);
           });
       })
        });
        describe('usual case', () => {
          describe.each([
            [utxoFirst, 2.03, [0.2, 0.3, 0.4, 1.2]], 
            [utxoFirst, 1.5, [0.04, 0.1, 0.2, 1.2]], 
            [utxoFirst, 10.0, [5, 6.3]],
            [utxoSecond, 2.03, [0.9, 1.2]], 
            [utxoSecond, 1.5, [0.9, 1.2]], 
            [utxoSecond, 10.0, [0.9, 1.2, 3.07, 5]],
          ])('.findSuitableUtxo(%o, %i, %i)', (utxo, orderValue, expected) => {
             test('', () => {
                expect(module.findSuitableUtxo(utxo, orderValue)).toEqual(expected);
             });
         })
          });
         describe('throws an error', () => {
          describe.each([
            [utxoFirst, -8], 
            [utxoFirst, 0], 
            [utxoFirst, 100.0],
            [utxoSecond, 299.03], 
            [utxoSecond, -1.5], 
            [utxoSecond, 0.0],
          ])('.findSuitableUtxo(%o, %i, %i)', (utxo, orderValue, expected) => {
             test('', () => {
                expect(module.findSuitableUtxo(utxo, orderValue)).toThrow();
             });
         })
          });

      test('one UTXO equals orderValue', () => { 
        expect(module.findSuitableUtxo([0.1, 0.3, 0.2, 0.03, 0.04, 0.4], 0.45)).toEqual([0.03, 0.04, 0.4]);
        });   
      test('basic', () => { 
        expect(module.findSuitableUtxo([0.1, 1, 0.4], 0.5)).toEqual([1]);
        }); 
});
