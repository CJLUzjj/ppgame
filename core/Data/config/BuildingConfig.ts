import { BuildingData } from '../BuildingData';
import { WorkType } from '../WorkData';
import { JsonMapParser } from '../../Util/JsonMapParser';
import buildingConfig from '../../../config/Building.json';
import { BuildingType } from '../common';

// 建筑模板配置
export const BuildingConfig: Map<BuildingType, Omit<BuildingData, 'id' | 'currentWorkers'>> = 
    JsonMapParser.fromJson(buildingConfig, {
        keyConverter: (key: string) => BuildingType[key as keyof typeof BuildingType],
        valueConverter: (value: any, key: string) => ({
            ...value,
            type: BuildingType[value.type as keyof typeof BuildingType],
            workTypes: value.workTypes.map((type: string) => WorkType[type as keyof typeof WorkType])
            })
        }
    );