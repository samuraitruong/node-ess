
export interface ESSData {
    sysSn?: string;
    SumData?: any;
    OneDateEnergy?: any;
    LastPower?: any;
    ChargeConfig?: any;
    DisChargeConfig?: any;
}

export interface ChargeSettings {
    sysSn: string;
    gridCharge: number;
    timeChaf1: string;
    timeChae1: string;
    timeChaf2: string;
    timeChae2: string;
    batHighCap: number;
}

export interface DischargeSettings {
    sysSn: string;
    ctrDis: number;
    timeDisf1: string;
    timeDise1: string;
    timeDisf2: string;
    timeDise2: string;
    batUseCap: number;
}

export interface ApiResponse<T> {
    msg: string;
    data: T | null;
}