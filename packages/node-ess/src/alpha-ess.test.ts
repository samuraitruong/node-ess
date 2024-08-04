import { AlphaESS } from './alpha-ess'; // Adjust the path as necessary
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);

describe('AlphaESS', () => {
    let alphaESS: AlphaESS;

    beforeEach(() => {
        alphaESS = new AlphaESS('testAppID', 'testAppSecret');
    });

    afterEach(() => {
        mockAxios.reset();
    });

    test('should fetch ESS list', async () => {
        const mockData = { msg: 'Success', data: [{ sysSn: 'SN001' }] };
        mockAxios.onGet('/getEssList').reply(200, mockData);

        const essList = await alphaESS.getESSList();
        expect(essList).toEqual(mockData.data);
    });

    test('should return null on fetching ESS list when response is not success', async () => {
        const mockData = { msg: 'Error', data: null };
        mockAxios.onGet('/getEssList').reply(200, mockData);

        const essList = await alphaESS.getESSList();
        expect(essList).toBeNull();
    });

    test('should handle error when fetching ESS list', async () => {
        mockAxios.onGet('/getEssList').reply(500);

        const essList = await alphaESS.getESSList();
        expect(essList).toBeNull();
    });

    test('should fetch last power data', async () => {
        const mockData = { msg: 'Success', data: { power: 100 } };
        mockAxios.onGet('/getLastPowerData?sysSn=SN001').reply(200, mockData);

        const powerData = await alphaESS.getLastPowerData('SN001');
        expect(powerData).toEqual(mockData.data);
    });

    test('should update charge config info', async () => {
        const mockData = { msg: 'Success', data: null };
        mockAxios.onPost('/updateChargeConfigInfo').reply(200, mockData);

        const response = await alphaESS.updateChargeConfigInfo('SN001', 100, 1, '08:00', '09:00', '10:00', '11:00');
        expect(response).toBeNull();
    });

    test('should return null on update charge config when response is not success', async () => {
        const mockData = { msg: 'Error', data: null };
        mockAxios.onPost('/updateChargeConfigInfo').reply(200, mockData);

        const response = await alphaESS.updateChargeConfigInfo('SN001', 100, 1, '08:00', '09:00', '10:00', '11:00');
        expect(response).toBeNull();
    });

    test('should handle error on update charge config', async () => {
        mockAxios.onPost('/updateChargeConfigInfo').reply(500);

        const response = await alphaESS.updateChargeConfigInfo('SN001', 100, 1, '08:00', '09:00', '10:00', '11:00');
        expect(response).toBeNull();
    });

    test('should set battery charge', async () => {
        const mockData = { msg: 'Success', data: null };
        mockAxios.onPost('updateChargeConfigInfo').reply(200, mockData);

        await expect(alphaESS.setBatteryCharge('SN001', true, '08:00', '09:00', '10:00', '11:00', 80)).resolves.toBeUndefined();
    });

    test('should handle error while setting battery charge', async () => {
        mockAxios.onPost('updateChargeConfigInfo').reply(500);

        await expect(alphaESS.setBatteryCharge('SN001', true, '08:00', '09:00', '10:00', '11:00', 80)).rejects.toThrow();
    });

    test('should set battery discharge', async () => {
        const mockData = { msg: 'Success', data: null };
        mockAxios.onPost('updateDisChargeConfigInfo').reply(200, mockData);

        await expect(alphaESS.setBatteryDischarge('SN001', true, '08:00', '09:00', '10:00', '11:00', 80)).resolves.toBeUndefined();
    });

    test('should handle error while setting battery discharge', async () => {
        mockAxios.onPost('updateDisChargeConfigInfo').reply(500);

        await expect(alphaESS.setBatteryDischarge('SN001', true, '08:00', '09:00', '10:00', '11:00', 80)).rejects.toThrow();
    });
});
