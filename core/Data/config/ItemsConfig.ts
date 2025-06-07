import { ItemData } from '../ItemData';
import { JsonMapParser } from '../../Util/JsonMapParser';
import itemsConfig from '../../../config/Items.json';
import { ItemType } from '../common';

// 游戏道具数据库
export const ItemsConfig: Map<number, ItemData> = JsonMapParser.fromJson<number, ItemData>(
    itemsConfig,
    {
        keyConverter: (key: string) => parseInt(key),
        valueConverter: (value: any) => ({
            ...value,
            type: ItemType[value.type as keyof typeof ItemType]
        })
    }
);