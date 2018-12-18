import { Test, TestingModule } from '@nestjs/testing';
import { UtxoService } from '../src/service/utxo.service';

describe('AppController', () => {
  const service = new UtxoService();

  const utxoFirst: number[] = new Array(0.1, 0.3, 0.2, 5.0, 0.0001, 1.2, 0.03, 0.04, 0.4, 6.3, 0.00001);
  const utxoSecond: number[] = new Array(0.9, 0.03, 75.0, 0.00004, 3.07, 5.0, 0.00001, 1.2);

  // it('should return "Hello World!"', () => {
  //     const appController = app.get<AppController>(AppController);
  //     expect(appController.root()).toBe('Hello World!');
  //   });
  // });
  beforeAll(async () => {
  });
  describe('one of the UTXO equals orderValue', () => {
    describe.each([
      [utxoFirst, 0.00001, [0.0001]],
      [utxoFirst, 1.2, [5.0]],
      [utxoFirst, 5.0, [6.3]],
      [utxoSecond, 0.00001, [0.03]],
      [utxoSecond, 1.2, [3.07]],
      [utxoSecond, 5.0, [75]],
    ])('.findSuitableUtxo(%o, %i, %i)', (utxo, orderValue, expected) => {
      test('', () => {
        expect(service.findSuitableUtxo(utxo, orderValue)).toEqual(expected);
      });
    });
  });

  describe('one of the UTXO equals required BTC value', () => {
    describe.each([
      [[0.1, 0.3, 0.2, 5.0, 0.0001, 1.2, 0.03, 0.04, 0.4, 6.3, 0.00001, 0.00005335], 0.00001, [0.00005335]],
      [[0.1, 0.3, 0.2, 5.0, 0.0001, 1.2, 0.03, 0.04, 0.4, 6.3, 0.00001, 1.20004335], 1.2, [1.20004335]],
      [[0.9, 0.03, 75.0, 0.00004, 3.07, 5.0, 0.00001, 1.2, 5.00004335], 5.0, [5.00004335]],
    ])('.findSuitableUtxo(%o, %i, %i)', (utxo, orderValue, expected) => {
      test('', () => {
        expect(service.findSuitableUtxo(utxo, orderValue)).toEqual(expected);
      });
    });
  });
  describe('usual case', () => {
    describe.each([
      [utxoFirst, 1.5, [5.0]],
      [utxoFirst, 10.0, [5, 6.3]],
      [utxoSecond, 2.03, [3.07]],
      [utxoSecond, 1.5, [3.07]],
      [utxoSecond, 10.0, [75]],
    ])('.findSuitableUtxo(%o, %i, %i)', (utxo, orderValue, expected) => {
      test('', () => {
        expect(service.findSuitableUtxo(utxo, orderValue)).toEqual(expected);
      });
    });
  });
  describe('throws an error', () => {
    describe.each([
      [utxoFirst, -8],
      [utxoFirst, 0],
      [utxoFirst, 100.0],
      [utxoSecond, 299.03],
      [utxoSecond, -1.5],
      [utxoSecond, 0.0],
    ])('.findSuitableUtxo(%o, %i)', () => {
      test('', () => {
        function findUTXO() {
          // controller.validate(utxo, orderValue);
        }
        expect(findUTXO).toThrow();
      });
    });
  });
  describe('additional tests', () => {
    test('test1', () => {
      expect(service.findSuitableUtxo([0.1, 0.3, 0.2, 0.03, 0.04, 0.4], 0.45)).toEqual([0.1, 0.4]);
    });
    test('test2', () => {
      expect(service.findSuitableUtxo([0.1, 1, 0.4, 0.5], 0.5)).toEqual([1]);
    });
    test('test3', () => {
      expect(service.findSuitableUtxo([0.1, 0.3, 0.2, 0.03, 0.04, 0.4, 0.5], 0.25)).toEqual([0.3]);
    });
    test('test4', () => {
      expect(service.findSuitableUtxo([0.1, 0.3, 0.2, 0.03, 0.04, 0.4, 0.5], 0.55)).toEqual([0.1, 0.5]);
    });
  });

});
