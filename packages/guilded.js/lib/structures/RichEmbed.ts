import type { APIEmbed } from '@guildedjs/guilded-api-typings';

import { resolveColor } from '../util/MessageUtil';

/**
 * Heavy code taken from https://github.com/discordjs/discord.js/blob/stable/src/structures/MessageEmbed.js
 * Copyright 2015 - 2021 Amish Shah
 * Copyrights licensed under the Apache License 2.0, https://github.com/discordjs/discord.js/blob/master/LICENSE
 * Taken from https://github.com/discordjs/discord.js/blob/stable/src/util/Util.js#L436
 */

/**
 * Guilded RichEmbeds are identical to Discord RicEmbeds.
 */
export class RichEmbed {
    public data: APIEmbed = {};

    public constructor(data?: APIEmbed) {
        if (data) this.data = data;
    }

    public setFooter(text: string, icon_url?: string): this {
        this.data.footer = { text, icon_url };
        return this;
    }

    public setImage(url: string): this {
        this.data.image = { url };
        return this;
    }

    public setThumbnail(url: string): this {
        this.data.thumbnail = { url };
        return this;
    }

    public setAuthor(name: string, icon_url?: string, url?: string): this {
        this.data.author = { name, icon_url, url };
        return this;
    }

    public addField(name: string, value: string, inline?: boolean): this {
        this.addFields({ name, value, inline });
        return this;
    }

    public addFields(...fields: { inline?: boolean; name: string; value: string }[]): this {
        if (!this.data.fields) {
            this.data.fields = [];
        }
        this.data.fields?.push(...fields);
        return this;
    }

    public setColor(color: string | number | [number, number, number]): this {
        this.data.color = resolveColor(color);
        return this;
    }

    public setTimestamp(date: Date = new Date()): this {
        this.data.timestamp = date.toISOString();
        return this;
    }

    public setDescription(description: string): this {
        this.data.description = description;
        return this;
    }

    public setURL(url: string): this {
        this.data.url = url;
        return this;
    }

    public setTitle(title: string): this {
        this.data.title = title;
        return this;
    }

    public toJSON(): APIEmbed {
        return {
            title: this.data.title,
            description: this.data.description,
            url: this.data.url,
            timestamp: this.data.timestamp?.toString(),
            color: this.data.color,
            fields: this.data.fields,
            thumbnail: this.data.thumbnail,
            image: this.data.image,
            author: this.data.author
                ? {
                      name: this.data.author.name,
                      iconUrl: this.data.author.iconUrl ?? this.data.author.icon_url,
                      url: this.data.author.url,
                  }
                : undefined,
            footer: this.data.footer
                ? {
                      text: this.data.footer.text,
                      iconUrl: this.data.footer.iconUrl ?? this.data.footer.icon_url,
                  }
                : undefined,
        };
    }
}
