import WebSocket from 'ws';

import Client from '../structures/Client';
import GatewayHandler from './GatewayHandler';

export default class ClientGatewayHandler extends GatewayHandler {
    constructor(client: Client) {
        super(client);
        this.init();
    }

    init(): void {
        const socketURL = `wss://${this.client.rest.baseDomain}/socket.io/?jwt=undefined&EIO=3&transport=websocket`;
        this.ws = new WebSocket(socketURL, {
            headers: {
                Cookie: this.client.rest.cookieJar,
            },
        });
        this.client.emit('debug', 'WebSocket connection established');

        if (!this.client.ws) return;

        this.ws.on('open', () => {
            this.client.emit('debug', 'Gateway connection established');
        });
        this.ws.on('message', (incomingData: string) => {
            this.client.emit('debug', 'Gateway message recieved');
            this.dataRecieved(incomingData);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.ws.on('close', (closeData: any) => {
            this.client.emit('debug', 'Gateway connection terminated');
            this.client.emit('disconnected', closeData);
        });
    }

    // eslint-disable-next-line no-warning-comments
    // TODO: Separate actions in switch case statement
    /*
        Action Types:
        - ChatMessageCreated
        - ChatMessageUpdated
        - ChatMessageReactionAdded
        - TEAM_CHANNEL_ARCHIVED
        - TemporalChannelCreated
    */
    dataRecieved(incomingData: string): void {
        let data: string = incomingData;
        let opCode = '';
        for (const char of data) {
            if (!Number.isInteger(Number(char))) break;
            data = data.substr(1);
            opCode += char;
        }
        if (data.length < 3) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [event_name, event_data]: [string, Record<string, any>] = JSON.parse(data);
        this.client.emit('raw', event_data);
        switch (Number(opCode)) {
            case 0: {
                this.client.emit('debug', 'Heartbeat started...');
                this.heartbeater.start();
                break;
            }

            case 40: {
                this.ping = Date.now() - 4;
                this.client.emit('debug', 'Ping returned. ');
                break;
            }

            case 42: {
                switch (event_name) {
                    case 'ChatMessageCreated': {
                    }
                    case 'ChatMessageUpdated': {
                    }
                    case 'ChatMessageReactionAdded': {
                    }
                    case 'TemporalChannelCreated': {
                    }
                }
                break;
            }
        }
    }
}