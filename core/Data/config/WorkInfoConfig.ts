import { WorkInfo, WorkType } from '../WorkData';
import { JsonMapParser } from '../../Util/JsonMapParser';
import workConfigData from '../../../config/WorkInfo.json';

// 工作配置数据库
export const WorkInfoConfig: Map<WorkType, WorkInfo> = JsonMapParser.fromJson<WorkType, WorkInfo>(
    workConfigData,
    {
        keyConverter: (key: string) => WorkType[key as keyof typeof WorkType],
        valueConverter: (value: any) => ({
            ...value,
            workType: WorkType[value.workType as keyof typeof WorkType]
        })
    }
);

// 获取所有工作类型
export function getAllWorkTypes(): WorkType[] {
    return Array.from(WorkInfoConfig.keys());
}

// 根据等级获取可用的工作
export function getAvailableWorks(level: number): WorkInfo[] {
    return Array.from(WorkInfoConfig.values()).filter(config => config.requiredLevel <= level);
}