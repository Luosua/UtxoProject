import { Get, Controller, Param } from '@nestjs/common';
import { UtxoService } from 'service/utxo.service';

@Controller('api/utxo')
export class UtxoController {

    constructor(private readonly utxoService: UtxoService) {}

    @Get('getUtxo/:btcAddress/:orderValue')
    async getUtxo(@Param('btcAddress') btcAddress: string, @Param('orderValue') orderValue) {
        return this.utxoService.getUTXO(btcAddress, orderValue);
    }
}
