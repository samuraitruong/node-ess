import axios, { AxiosInstance } from 'axios';
import { Logger } from 'tslog';
import * as crypto from 'crypto';
import { ApiResponse, ChargeSettings, DischargeSettings, ESSData } from './model';

const logger = new Logger();
export const BASEURL = "https://openapi.alphaess.com/api";

export class AlphaESS {
    private appID: string;
    private appSecret: string;
    private accessToken: string | null = null;
    private expiresIn: number | null = null;
    private tokenCreateTime: number | null = null;
    private refreshToken: string | null = null;
    private axiosInstance: AxiosInstance;
    private timeout: number;

    constructor(appID: string, appSecret: string, timeout: number = 30000) {
        this.appID = appID;
        this.appSecret = appSecret;
        this.timeout = timeout;

        this.axiosInstance = axios.create({
            baseURL: BASEURL,
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'no-cache',
            }
        });
    }

    private generateHeaders(): { [key: string]: string } {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const sign = crypto.createHash('sha512').update(`${this.appID}${this.appSecret}${timestamp}`).digest('hex');

        return {
            timestamp,
            sign,
            appId: this.appID,
            timeStamp: timestamp,
        };
    }

    private async apiGet<T>(path: string): Promise<T | null> {
        try {
            const headers = { ...this.generateHeaders() };
            const response = await this.axiosInstance.get<ApiResponse<T>>(path, { headers });

            if (response.data.msg !== 'Success' || response.data.data === null) {
                logger.error(`Unexpected response: ${JSON.stringify(response.data)} when calling ${path}`);
                return null;
            }
            return response.data.data;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    private async apiPost<T>(path: string, json: object): Promise<T | null> {
        try {
            const headers = { ...this.generateHeaders() };
            const response = await this.axiosInstance.post<ApiResponse<T>>(path, json, { headers });

            if (response.data.msg !== 'Success') {
                if (response.data.msg === 'The maximum number of requests has been reached') {
                    // handle retry 

                }
                logger.error(`Unexpected response: ${JSON.stringify(response.data)} when calling ${path}`);
                return null;
            }
            return response.data.data;
        } catch (error) {

            logger.error(error);
            throw error;
        }
    }

    async getESSList(): Promise<ESSData[] | null> {
        try {
            const resource = '/getEssList';
            logger.debug(`Trying to call ${resource}`);
            return await this.apiGet<ESSData[]>(resource);
        } catch (error) {
            logger.error(`Error: ${error}`);
            return null;
        }
    }

    async getLastPowerData(sysSn: string): Promise<any> {
        try {
            const resource = `/getLastPowerData?sysSn=${sysSn}`;
            logger.debug(`Trying to call ${resource}`);
            return await this.apiGet<any>(resource);
        } catch (error) {
            logger.error(`Error: ${error}`);
            return null;
        }
    }

    async getOneDayPowerBySn(sysSn: string, queryDate: string): Promise<any> {
        try {
            const localDate = new Date().toISOString().split('T')[0];
            const dateToQuery = queryDate === localDate ? queryDate : localDate;
            const resource = `/getOneDayPowerBySn?sysSn=${sysSn}&queryDate=${dateToQuery}`;
            logger.debug(`Trying to call ${resource}`);
            return await this.apiGet<any>(resource);
        } catch (error) {
            logger.error(`Error: ${error}`);
            return null;
        }
    }

    async getSumDataForCustomer(sysSn: string): Promise<any> {
        try {
            const resource = `/getSumDataForCustomer?sysSn=${sysSn}`;
            logger.debug(`Trying to call ${resource}`);
            return await this.apiGet<any>(resource);
        } catch (error) {
            logger.error(`Error: ${error}`);
            return null;
        }
    }

    async getOneDateEnergyBySn(sysSn: string, queryDate: string): Promise<any> {
        try {
            const localDate = new Date().toISOString().split('T')[0];
            const dateToQuery = queryDate === localDate ? queryDate : localDate;
            const resource = `/getOneDateEnergyBySn?sysSn=${sysSn}&queryDate=${dateToQuery}`;
            logger.debug(`Trying to call ${resource}`);
            return await this.apiGet<any>(resource);
        } catch (error) {
            logger.error(`Error: ${error}`);
            return null;
        }
    }

    async getChargeConfigInfo(sysSn: string): Promise<any> {
        try {
            const resource = `/getChargeConfigInfo?sysSn=${sysSn}`;
            logger.debug(`Trying to call ${resource}`);
            return await this.apiGet<any>(resource);
        } catch (error) {
            logger.error(`Error: ${error}`);
            return null;
        }
    }

    async getDisChargeConfigInfo(sysSn: string): Promise<any> {
        try {
            const resource = `/getDisChargeConfigInfo?sysSn=${sysSn}`;
            logger.debug(`Trying to call ${resource}`);
            return await this.apiGet<any>(resource);
        } catch (error) {
            logger.error(`Error: ${error}`);
            return null;
        }
    }

    async updateChargeConfigInfo(sysSn: string, batHighCap: number, gridCharge: number, timeChae1: string, timeChae2: string, timeChaf1: string, timeChaf2: string): Promise<any> {
        try {
            const resource = '/updateChargeConfigInfo';
            const settings: ChargeSettings = {
                sysSn,
                batHighCap,
                gridCharge,
                timeChae1,
                timeChae2,
                timeChaf1,
                timeChaf2,
            };

            logger.debug(`Trying to call ${resource} with settings ${JSON.stringify(settings)}`);
            return await this.apiPost<any>(resource, settings);
        } catch (error) {
            logger.error(`Error: ${error}`);
            return null;
        }
    }

    async updateDisChargeConfigInfo(sysSn: string, batUseCap: number, ctrDis: number, timeDise1: string, timeDise2: string, timeDisf1: string, timeDisf2: string): Promise<any> {
        try {
            const resource = '/updateDisChargeConfigInfo';
            const settings: DischargeSettings = {
                sysSn,
                batUseCap,
                ctrDis,
                timeDise1,
                timeDise2,
                timeDisf1,
                timeDisf2,
            };

            logger.debug(`Trying to call ${resource} with settings ${JSON.stringify(settings)}`);
            return await this.apiPost<any>(resource, settings);
        } catch (error) {
            logger.error(`Error: ${error}`);
            return null;
        }
    }

    async getData(selfDelay: number = 0): Promise<ESSData[]> {
        try {
            const allData: ESSData[] = [];
            const units = await this.getESSList();
            if (units) {
                for (const unit of units) {
                    if (unit.sysSn) {
                        const serial = unit.sysSn;
                        unit.SumData = await this.getSumDataForCustomer(serial);
                        await this.delay(selfDelay);
                        unit.OneDateEnergy = await this.getOneDateEnergyBySn(serial, new Date().toISOString().split('T')[0]);
                        await this.delay(selfDelay);
                        unit.LastPower = await this.getLastPowerData(serial);
                        await this.delay(selfDelay);
                        unit.ChargeConfig = await this.getChargeConfigInfo(serial);
                        await this.delay(selfDelay);
                        unit.DisChargeConfig = await this.getDisChargeConfigInfo(serial);
                        allData.push(unit);
                        logger.debug(allData);
                    }
                }
            }
            return allData;
        } catch (error) {
            logger.error(`Error: ${error}`);
            throw error;
        }
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async authenticate(): Promise<boolean> {
        try {
            const units = await this.getESSList();
            return units ? units.some(unit => unit.sysSn !== undefined) : false;
        } catch (error) {

        }
        return false;
    }

    async setBatteryCharge(
        serial: string,
        enabled: boolean,
        cp1start: string,
        cp1end: string,
        cp2start: string,
        cp2end: string,
        chargeStopSOC: number
    ): Promise<void> {
        /** Set battery grid charging */
        try {
            const settings: ChargeSettings = {
                sysSn: serial,
                gridCharge: Number(enabled),
                timeChaf1: cp1start,
                timeChae1: cp1end,
                timeChaf2: cp2start,
                timeChae2: cp2end,
                batHighCap: chargeStopSOC,
            };

            logger.debug(`Trying to set charge settings for system ${serial}`);
            await this.apiPost<ChargeSettings>("updateChargeConfigInfo", settings);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async setBatteryDischarge(
        serial: string,
        enabled: boolean,
        dp1start: string,
        dp1end: string,
        dp2start: string,
        dp2end: string,
        dischargeCutoffSOC: number
    ): Promise<void> {
        /** Set battery discharging */
        try {
            const settings: DischargeSettings = {
                sysSn: serial,
                ctrDis: Number(enabled),
                timeDisf1: dp1start,
                timeDise1: dp1end,
                timeDisf2: dp2start,
                timeDise2: dp2end,
                batUseCap: dischargeCutoffSOC,
            };

            logger.debug(`Trying to set discharge settings for system ${serial}`);
            await this.apiPost<DischargeSettings>("updateDisChargeConfigInfo", settings);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}

