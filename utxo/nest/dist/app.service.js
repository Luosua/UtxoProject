"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const rpn = require("request-promise-native");
let AppService = class AppService {
    constructor() {
        this.oneBytePrice = 17;
        this.defaultTransWeight = 255;
        this.btcToSatoshiCoef = 0.00000001;
        this.extraInputWeight = 147;
    }
    calculateMinPrice() {
        const priceInSatoshi = this.defaultTransWeight * this.oneBytePrice;
        return priceInSatoshi * this.btcToSatoshiCoef;
    }
    findTotalBalance(utxo) {
        let balance = 0;
        for (let i = 0; i < utxo.length; i++) {
            balance += utxo[i];
        }
        return balance;
    }
    findSuitableUtxo(utxo, orderAmount) {
        const requiredUtxo = new Array();
        const btcRequired = orderAmount + this.calculateMinPrice();
        let tempBtcRequired = btcRequired;
        let difference = Number.MAX_VALUE;
        let tempSum = 0;
        for (let i = 0; i < utxo.length; i++) {
            if (utxo[i] === btcRequired) {
                requiredUtxo.length = 0;
                requiredUtxo.push(utxo[i]);
                return requiredUtxo;
            }
            else if (utxo[i] > btcRequired && utxo[i] - btcRequired < difference) {
                difference = utxo[i] - btcRequired;
                requiredUtxo.length = 0;
                requiredUtxo.push(utxo[i]);
            }
        }
        if (requiredUtxo.length !== 0) {
            return requiredUtxo;
        }
        utxo.sort();
        tempSum = utxo[utxo.length - 1];
        tempBtcRequired += this.extraInputWeight * this.oneBytePrice * this.btcToSatoshiCoef;
        for (let i = 0; i < utxo.length - 1; i++) {
            if (tempSum + utxo[i] >= tempBtcRequired) {
                tempSum += utxo[i];
                requiredUtxo.push(utxo[utxo.length - 1]);
                requiredUtxo.push(utxo[i]);
                return requiredUtxo.sort();
            }
        }
        requiredUtxo.push(utxo[utxo.length - 1]);
        for (let i = utxo.length - 2; i >= 0; i--) {
            tempSum += utxo[i];
            requiredUtxo.push(utxo[i]);
            if (tempSum >= tempBtcRequired) {
                return requiredUtxo.sort();
            }
            tempBtcRequired += this.extraInputWeight * this.oneBytePrice * this.btcToSatoshiCoef;
        }
    }
    fillUTXO(btcAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const utxo = new Array();
            const options = {
                method: 'get',
                uri: 'https://chain.so/api/v2/get_tx_unspent/btctest/' + btcAddress,
                json: true,
            };
            const response = yield rpn(options);
            const data = response.data['txs'];
            for (let i = 0; i < data.length; i++) {
                utxo.push(data[i].value);
            }
            return utxo;
        });
    }
    getUTXO(btcAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(yield this.fillUTXO(btcAddress));
        });
    }
};
AppService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map