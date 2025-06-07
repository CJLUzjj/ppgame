import { MonsterType } from '../common';
import { WorkAbility, WorkType } from '../WorkData';
import { JsonMapParser } from '../../Util/JsonMapParser';
import monsterWorkConfig from '../../../config/MonsterWorkAbility.json';

// 怪物工作能力模板
export const MonsterWorkAbilityConfig: Map<MonsterType, WorkAbility[]> = JsonMapParser.fromJson<MonsterType, WorkAbility[]>(
    monsterWorkConfig,
    {
        keyConverter: (key: string) => MonsterType[key as keyof typeof MonsterType],
        valueConverter: (value: any[]) => value.map(ability => ({
            workType: WorkType[ability.workType as keyof typeof WorkType],
            efficiency: ability.efficiency
        }))
    }
);