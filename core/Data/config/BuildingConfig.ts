import { BuildingData } from '../BuildingData';
import { WorkType } from '../WorkData';
import { JsonMapParser } from '../../Util/JsonMapParser';
import { BuildingType } from '../common';

// 建筑配置数据
const buildingConfigData = {
    "Farm": {
        "type": "Farm",
        "name": "农场",
        "description": "种植农作物，提供食物和草药",
        "maxWorkers": 3,
        "level": 1,
        "efficiency": 1.0,
        "cost": { "wood": 20, "stone": 10 },
        "workTypes": ["Farming"],
        "workerList": []
    },
    "Mine": {
        "type": "Mine",
        "name": "矿场",
        "description": "挖掘矿物资源，获得石头和金属",
        "maxWorkers": 4,
        "level": 1,
        "efficiency": 1.0,
        "cost": { "wood": 15, "stone": 25 },
        "workTypes": ["Mining"],
        "workerList": []
    },
    "Lumberyard": {
        "type": "Lumberyard",
        "name": "伐木场",
        "description": "砍伐树木，获得木材资源",
        "maxWorkers": 3,
        "level": 1,
        "efficiency": 1.0,
        "cost": { "stone": 15 },
        "workTypes": ["Logging"],
        "workerList": []
    },
    "Workshop": {
        "type": "Workshop",
        "name": "工坊",
        "description": "制作各种工具和装备",
        "maxWorkers": 2,
        "level": 1,
        "efficiency": 1.0,
        "cost": { "wood": 30, "stone": 20, "metal": 10 },
        "workTypes": ["Crafting"],
        "workerList": []
    },
    "Kitchen": {
        "type": "Kitchen",
        "name": "厨房",
        "description": "烹制食物和药剂",
        "maxWorkers": 2,
        "level": 1,
        "efficiency": 1.0,
        "cost": { "wood": 25, "stone": 15 },
        "workTypes": ["Cooking"],
        "workerList": []
    },
    "Forge": {
        "type": "Forge",
        "name": "锻造场",
        "description": "建造和修理各种设施",
        "maxWorkers": 3,
        "level": 1,
        "efficiency": 1.0,
        "cost": { "wood": 20, "stone": 30, "metal": 15 },
        "workTypes": ["Construction"],
        "workerList": []
    },
    "Warehouse": {
        "type": "Warehouse",
        "name": "仓库",
        "description": "存储和运输物资",
        "maxWorkers": 4,
        "level": 1,
        "efficiency": 1.0,
        "cost": { "wood": 40, "stone": 20 },
        "workTypes": ["Transport"],
        "workerList": []
    },
    "Barracks": {
        "type": "Barracks",
        "name": "军营",
        "description": "训练和部署守卫",
        "maxWorkers": 5,
        "level": 1,
        "efficiency": 1.0,
        "cost": { "wood": 35, "stone": 25, "metal": 20 },
        "workTypes": ["Guarding"],
        "workerList": []
    },
    "Laboratory": {
        "type": "Laboratory",
        "name": "实验室",
        "description": "进行研究和实验",
        "maxWorkers": 2,
        "level": 1,
        "efficiency": 1.0,
        "cost": { "wood": 30, "stone": 40, "metal": 25, "gold": 50 },
        "workTypes": ["Research"],
        "workerList": []
    },
    "HuntingLodge": {
        "type": "HuntingLodge",
        "name": "狩猎小屋",
        "description": "组织狩猎活动，获得肉类和皮革",
        "maxWorkers": 3,
        "level": 1,
        "efficiency": 1.0,
        "cost": { "wood": 30, "stone": 10 },
        "workTypes": ["Hunting"],
        "workerList": []
    },
    "RestArea": {
        "type": "RestArea",
        "name": "休息区",
        "description": "帕鲁休息恢复体力的地方",
        "maxWorkers": 6,
        "level": 1,
        "efficiency": 1.2,
        "cost": { "wood": 15, "stone": 5 },
        "workTypes": ["Rest"],
        "workerList": []
    }
};

// 建筑模板配置
export const BuildingConfig: Map<BuildingType, Omit<BuildingData, 'id' | 'currentWorkers'>> = 
    JsonMapParser.fromJson(buildingConfigData, {
        keyConverter: (key: string) => BuildingType[key as keyof typeof BuildingType],
        valueConverter: (value: any, key: string) => ({
            ...value,
            type: BuildingType[value.type as keyof typeof BuildingType],
            workTypes: value.workTypes.map((type: string) => WorkType[type as keyof typeof WorkType])
            })
        }
    );