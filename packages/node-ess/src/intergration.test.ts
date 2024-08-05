import { AlphaESS } from './alpha-ess'; // Adjust the path as necessary
import dotenv from 'dotenv';

dotenv.config();

describe('AlphaESS Integration Tests', () => {
    let alphaESS: AlphaESS;
    let essListCache: any[] | null = null;

    beforeAll(() => {
        const appID = process.env.ESS_APP_ID;
        const appSecret = process.env.ESS_APP_SECRET;

        if (!appID || !appSecret) {
            throw new Error('APP_ID and APP_SECRET must be set in .env file');
        }

        alphaESS = new AlphaESS(appID, appSecret);
    });

    const getCachedESSList = async () => {
        if (!essListCache) {
            essListCache = await alphaESS.getESSList();
        }
        return essListCache;
    };

    test('should fetch ESS list from actual API', async () => {
        const essList = await getCachedESSList();
        expect(essList).toBeTruthy();
        expect(Array.isArray(essList)).toBe(true);
    });

    test.only('should fetch last power data from actual API', async () => {
        const essList = await getCachedESSList();
        if (essList && essList.length > 0) {
            const serial = essList[0].sysSn;
            const powerData = await alphaESS.getLastPowerData(serial as string);

            console.log("powerData", powerData)
            expect(powerData).toBeTruthy();
        }
    });

    test('should fetch charge config info from actual API', async () => {
        const essList = await getCachedESSList();
        if (essList && essList.length > 0) {
            const serial = essList[0].sysSn;
            const chargeConfig = await alphaESS.getChargeConfigInfo(serial as string);

            expect(chargeConfig).toBeTruthy();
        }
    });

    test.skip('should set battery charge with actual API call', async () => {
        const essList = await getCachedESSList();
        if (essList && essList.length > 0) {
            const serial = essList[0].sysSn;
            await expect(alphaESS.setBatteryCharge(serial as string, true, '08:00', '09:00', '10:00', '11:00', 80)).resolves.toBeUndefined();
        }
    });

    test.skip('should set battery discharge with actual API call', async () => {
        const essList = await getCachedESSList();
        if (essList && essList.length > 0) {
            const serial = essList[0].sysSn;
            await expect(alphaESS.setBatteryDischarge(serial as string, true, '08:00', '09:00', '10:00', '11:00', 80)).resolves.toBeUndefined();
        }
    });
});
