import { AlphaESS } from './AlphaESS'; // Adjust the path as necessary
import dotenv from 'dotenv';

dotenv.config();

describe('AlphaESS Integration Tests', () => {
    let alphaESS: AlphaESS;

    beforeAll(() => {
        const appID = process.env.APP_ID;
        const appSecret = process.env.APP_SECRET;

        if (!appID || !appSecret) {
            throw new Error('APP_ID and APP_SECRET must be set in .env file');
        }

        alphaESS = new AlphaESS(appID, appSecret);
    });

    test('should fetch ESS list from actual API', async () => {
        const essList = await alphaESS.getESSList();
        expect(essList).toBeTruthy();
        expect(Array.isArray(essList)).toBe(true);
    });

    test('should fetch last power data from actual API', async () => {
        const essList = await alphaESS.getESSList();
        if (essList && essList.length > 0) {
            const serial = essList[0].sysSn;
            const powerData = await alphaESS.getLastPowerData(serial);
            expect(powerData).toBeTruthy();
        }
    });

    test('should fetch charge config info from actual API', async () => {
        const essList = await alphaESS.getESSList();
        if (essList && essList.length > 0) {
            const serial = essList[0].sysSn;
            const chargeConfig = await alphaESS.getChargeConfigInfo(serial);
            expect(chargeConfig).toBeTruthy();
        }
    });

    test('should set battery charge with actual API call', async () => {
        const essList = await alphaESS.getESSList();
        if (essList && essList.length > 0) {
            const serial = essList[0].sysSn;
            await expect(alphaESS.setBatteryCharge(serial, true, '08:00', '09:00', '10:00', '11:00', 80)).resolves.toBeUndefined();
        }
    });

    test('should set battery discharge with actual API call', async () => {
        const essList = await alphaESS.getESSList();
        if (essList && essList.length > 0) {
            const serial = essList[0].sysSn;
            await expect(alphaESS.setBatteryDischarge(serial, true, '08:00', '09:00', '10:00', '11:00', 80)).resolves.toBeUndefined();
        }
    });
});
