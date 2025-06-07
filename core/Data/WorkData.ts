// 工作类型枚举
export enum WorkType {
    None = "None",               // 无
    Mining = "Mining",           // 挖矿
    Logging = "Logging",         // 伐木
    Farming = "Farming",         // 农耕
    Construction = "Construction", // 建造
    Crafting = "Crafting",       // 制作
    Cooking = "Cooking",         // 烹饪
    Transport = "Transport",     // 运输
    Guarding = "Guarding",       // 守卫
    Research = "Research",       // 研究
    Hunting = "Hunting",         // 狩猎
    Rest = "Rest"                // 休息
}

// 工作能力接口
export class WorkAbility {
    constructor(workType: WorkType, efficiency: number) {
        this.workType = workType;
        this.efficiency = efficiency;
    }
    workType: WorkType;
    efficiency: number;  // 效率 1-100
}

// 工作产出接口
export class WorkOutput {
    constructor(itemId: number, quantity: number, probability: number) {
        this.itemId = itemId;
        this.quantity = quantity;
        this.probability = probability;
    }
    itemId: number;
    quantity: number;
    probability: number; // 产出概率 0-1
}

export class WorkInfo {
    constructor(workType: WorkType, name: string, description: string, baseTime: number, requiredLevel: number, outputs: WorkOutput[], stamminaCost: number) {
        this.workType = workType;
        this.name = name;
        this.description = description;
        this.baseTime = baseTime;
        this.requiredLevel = requiredLevel;
        this.outputs = outputs;
        this.stamminaCost = stamminaCost;
    }
    workType: WorkType;
    name: string;
    description: string;
    baseTime: number;
    requiredLevel: number;
    outputs: WorkOutput[];
    stamminaCost: number;    // 体力消耗
}