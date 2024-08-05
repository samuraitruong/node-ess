# AlphaESS API Client

This is a Node.js client for interacting with the AlphaESS API. It allows you to authenticate, retrieve data, and configure charging and discharging settings for your ESS (Energy Storage System) units.

## Installation

To install the package, run the following command:

```sh
npm install @samuraitruong/node-ess

or

yarn add @samuraitruong/node-ess

or 

pnpm -i @samuraitruong/node-ess
```


## Usage
### Importing the Library

First, you need to import the necessary modules and create an instance of the AlphaESS class.

```ts
import { AlphaESS } from '@samuraitruong/node-ess';
import { Logger } from 'tslog';

const logger = new Logger();
const alphaess = new AlphaESS('your-app-id', 'your-app-secret');
```

### Authentication

Before making any API calls, you should authenticate to ensure you have access to the necessary data.
```ts
async function authenticate() {
    const isAuthenticated = await alphaess.authenticate();
    if (isAuthenticated) {
        logger.info('Authentication successful');
    } else {
        logger.error('Authentication failed');
    }
}

authenticate();
```

### Retrieve ESS Data
You can retrieve a list of ESS units and their data.

```ts 
async function getESSData() {
    try {
        const data = await alphaess.getData();
        console.log(data);
    } catch (error) {
        logger.error('Error retrieving ESS data:', error);
    }
}

getESSData();
```

### Set Battery Charge Settings
You can update the charging configuration for a specific ESS unit.

```ts 
async function updateChargeConfig() {
    try {
        await alphaess.setBatteryCharge(
            'your-serial-number',
            true,
            '08:00',
            '12:00',
            '14:00',
            '18:00',
            80
        );
        logger.info('Charge configuration updated successfully');
    } catch (error) {
        logger.error('Error updating charge configuration:', error);
    }
}

updateChargeConfig();
```

### Set Battery Discharge Settings
You can update the discharging configuration for a specific ESS unit.

```ts 
async function updateDischargeConfig() {
    try {
        await alphaess.setBatteryDischarge(
            'your-serial-number',
            true,
            '18:00',
            '22:00',
            '00:00',
            '04:00',
            20
        );
        logger.info('Discharge configuration updated successfully');
    } catch (error) {
        logger.error('Error updating discharge configuration:', error);
    }
}

updateDischargeConfig();
```
## API Methods
### AlphaESS Class
- constructor(appID: string, appSecret: string, timeout: number = 30000): Initializes the client with your app ID, app secret, and an optional timeout.
### Authentication
- async authenticate(): Promise<boolean>: Authenticates with the AlphaESS API.
### Data Retrieval
- async getESSList(): Promise<ESSData[] | null>: Retrieves a list of ESS units.
- async getLastPowerData(sysSn: string): Promise<any>: Retrieves the latest power data for a specific ESS unit.
- async getOneDayPowerBySn(sysSn: string, queryDate: string): Promise<any>: Retrieves one day's power data for a specific ESS unit.
- async getSumDataForCustomer(sysSn: string): Promise<any>: Retrieves summarized data for a specific customer.
- async getOneDateEnergyBySn(sysSn: string, queryDate: string): Promise<any>: Retrieves one day's energy data for a specific ESS unit.
- async getChargeConfigInfo(sysSn: string): Promise<any>: Retrieves the charging configuration for a specific ESS unit.
- async getDisChargeConfigInfo(sysSn: string): Promise<any>: Retrieves the discharging configuration for a specific ESS unit.
### Configuration Updates
- async updateChargeConfigInfo(sysSn: string, batHighCap: number, gridCharge: number, timeChae1: string, timeChae2: string, timeChaf1: string, timeChaf2: string): Promise<any>: Updates the charging configuration for a specific ESS unit.
- async updateDisChargeConfigInfo(sysSn: string, batUseCap: number, ctrDis: number, timeDise1: string, timeDise2: string, timeDisf1: string, timeDisf2: string): Promise<any>: Updates the discharging configuration for a specific ESS unit.
## Example
Here's an example of how to use the client to retrieve ESS data and update the charge and discharge configurations:

```ts 
import { AlphaESS } from '@samuraitruong/node-ess';
import { Logger } from 'tslog';

const logger = new Logger();
const alphaess = new AlphaESS('your-app-id', 'your-app-secret');

async function main() {
    // Authenticate
    const isAuthenticated = await alphaess.authenticate();
    if (!isAuthenticated) {
        logger.error('Authentication failed');
        return;
    }

    // Get ESS Data
    const essData = await alphaess.getData();
    console.log('ESS Data:', essData);

    // Update Charge Configuration
    await alphaess.setBatteryCharge(
        'your-serial-number',
        true,
        '08:00',
        '12:00',
        '14:00',
        '18:00',
        80
    );

    // Update Discharge Configuration
    await alphaess.setBatteryDischarge(
        'your-serial-number',
        true,
        '18:00',
        '22:00',
        '00:00',
        '04:00',
        20
    );
}

main();
```
## Logging
This client uses tslog for logging. You can configure the logger as needed by importing and using the Logger class from tslog.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.