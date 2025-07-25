import { ItemData } from '../ItemData';
import { JsonMapParser } from '../../Util/JsonMapParser';
import { ItemType } from '../common';

// 物品配置数据
const itemsConfigData = {
    "1": {
        "id": 1,
        "name": "石材",
        "type": "Stone",
        "rarity": 1,
        "value": 5,
        "description": "普通的石头，用于建造和制作"
    },
    "2": {
        "id": 2,
        "name": "木材",
        "type": "Wood",
        "rarity": 1,
        "value": 3,
        "description": "常见的木材，建造必需品"
    },
    "3": {
        "id": 3,
        "name": "铁矿石",
        "type": "Metal",
        "rarity": 2,
        "value": 15,
        "description": "坚硬的铁矿石，可以锻造装备"
    },
    "4": {
        "id": 4,
        "name": "魔法水晶",
        "type": "Crystal",
        "rarity": 3,
        "value": 50,
        "description": "蕴含魔力的水晶，珍贵的材料"
    },
    "5": {
        "id": 5,
        "name": "浆果",
        "type": "Food",
        "rarity": 1,
        "value": 2,
        "description": "新鲜的浆果，可以恢复体力"
    },
    "6": {
        "id": 6,
        "name": "肉类",
        "type": "Food",
        "rarity": 2,
        "value": 8,
        "description": "新鲜的肉类，营养丰富"
    },
    "7": {
        "id": 7,
        "name": "治疗草药",
        "type": "Herb",
        "rarity": 2,
        "value": 12,
        "description": "具有治疗效果的草药"
    },
    "8": {
        "id": 8,
        "name": "布料",
        "type": "Cloth",
        "rarity": 2,
        "value": 10,
        "description": "柔软的布料，可制作装备"
    },
    "9": {
        "id": 9,
        "name": "皮革",
        "type": "Leather",
        "rarity": 2,
        "value": 20,
        "description": "坚韧的皮革，制作防具的好材料"
    },
    "10": {
        "id": 10,
        "name": "生命药剂",
        "type": "Potion",
        "rarity": 3,
        "value": 30,
        "description": "恢复生命值的药剂"
    },
    "11": {
        "id": 11,
        "name": "铁剑",
        "type": "Weapon",
        "rarity": 3,
        "value": 100,
        "description": "锋利的铁制剑，攻击力不错"
    },
    "12": {
        "id": 12,
        "name": "皮甲",
        "type": "Armor",
        "rarity": 2,
        "value": 80,
        "description": "轻便的皮制护甲"
    },
    "13": {
        "id": 13,
        "name": "铁镐",
        "type": "Tool",
        "rarity": 2,
        "value": 60,
        "description": "用于挖矿的铁制镐子"
    },
    "14": {
        "id": 14,
        "name": "铁斧",
        "type": "Tool",
        "rarity": 2,
        "value": 55,
        "description": "用于伐木的铁制斧头"
    },
    "15": {
        "id": 15,
        "name": "龙鳞",
        "type": "Rare",
        "rarity": 4,
        "value": 200,
        "description": "稀有的龙鳞，制作传说装备的材料"
    },
    "16": {
        "id": 16,
        "name": "古代符文",
        "type": "Legendary",
        "rarity": 5,
        "value": 500,
        "description": "神秘的古代符文，蕴含强大力量"
    }
};

// 游戏道具数据库
export const ItemsConfig: Map<number, ItemData> = JsonMapParser.fromJson<number, ItemData>(
    itemsConfigData,
    {
        keyConverter: (key: string) => parseInt(key),
        valueConverter: (value: any) => ({
            ...value,
            type: ItemType[value.type as keyof typeof ItemType]
        })
    }
);