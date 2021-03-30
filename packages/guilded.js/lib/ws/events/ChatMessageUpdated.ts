import { WSChatMessageUpdated } from '@guildedjs/guilded-api-typings';

import type { Client } from '../../structures/Client';
import {PartialMessage} from '../../structures/PartialMessage';
import Event from './Event';

export default class ChatMessageUpdatedEvent extends Event {
    constructor(client: Client) {
        super(client);
    }
    public ingest(data: WSChatMessageUpdated): (string | boolean)[] {
        if(data) {
            const channel = this.client.channels.cache.get(data.channelId);
            const oldMessage = channel?.messages?.cache.get(data.message.id);
            if(!oldMessage && !this.client.options?.partials?.includes("MESSAGE")) return [false, "Old message not cached!"]; 
            const newMessage = oldMessage?._clone().patch(data.message) ?? new PartialMessage(this.client, { ...data.message, channelId: data.channelId});
            this.client.emit("messageUpdate", oldMessage, newMessage);
        }
        
        return [false, 'passthrough'];
    }
}
