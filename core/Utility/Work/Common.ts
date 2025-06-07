import { WorkType } from "../../Data/WorkData";
import { MonsterType, PalStatus } from "../../Data/common";
import { MonsterWorkAbilityConfig } from "../../Data/config/MonsterWorkAbilityConfig";
import { WorkAbility } from "../../Data/WorkData";
import { Building } from "../../Entity/Building";
import { BuildingPropertyComponent } from "../../Component/Property/BuildingPropertyComponent";
import { WorkProgressComponent } from "../../Component/WorkProgressComponent";
import { World } from "../../Infra/World";
import { Avatar } from "../../Entity/Avatar";
import { Monster } from "../../Entity/Monster";
import { MonsterPropertyComponent } from "../../Component/Property/MonsterPropertyComponent";
import { WorkInfoConfig } from "../../Data/config/WorkInfoConfig";
import { MonsterBaseProperty } from "../../Data/MonsterData";
import { calculateWorkTime } from "../Building/CreateBuilding";
import { RestProgressComponent } from "core/Component/RestProgressComponent";
import { log } from "../../Interface/Service/LogService";
export function getMonsterWorkEfficiency(monsterType: MonsterType, workType: WorkType): number {
    const abilities = MonsterWorkAbilityConfig.get(monsterType);
    const ability = abilities?.find((a: WorkAbility) => a.workType === workType);
    return ability ? ability.efficiency : 0;
}

export function hasAvailableWorkSlot(building: Building, workType: WorkType): boolean {
    if (building.hasComponent("BuildingProperty")) {
        const buildingPropertyComponent = building.getComponent("BuildingProperty") as BuildingPropertyComponent;
        const data = buildingPropertyComponent.getData();
        if (data) {
            return data.currentWorkers < data.maxWorkers && data.workTypes.includes(workType);
        }
    }
    return false;
}

export function processStartWork(world: World, avatarId: number, buildingId: number, workType: WorkType, monsterId: number): boolean {
    const building = world.getEntitiesManager().getEntity(buildingId) as Building;
    if (!building) {
        log.info("建筑不存在", buildingId);
        return false;
    }

    const avatar = world.getEntitiesManager().getEntity(avatarId) as Avatar;
    if (!avatar) {
        log.info("avatar不存在", avatarId);
        return false;
    }

    const monster = world.getEntitiesManager().getEntity(monsterId) as Monster;
    if (!monster) {
        log.info("怪物不存在", monsterId);
        return false;
    }
    
    if (!checkCanStartWork(monster, building, workType)) {
        return false;
    }

    const buildingPropertyComponent = building.getComponent("BuildingProperty") as BuildingPropertyComponent;
    buildingPropertyComponent.addWorkers(monsterId);

    const monsterPropertyComponent = monster.getComponent("MonsterProperty") as MonsterPropertyComponent;
    monsterPropertyComponent.startWork(workType, buildingId, world.getCurrentVirtualTime());

    createWorkProgress(world, building, monsterId, workType, monsterPropertyComponent.baseProperty);
    return true;
}

function createWorkProgress(world: World, building: Building, monsterId: number, workType: WorkType, monsterProperty: MonsterBaseProperty): WorkProgressComponent | null {
    let workProgress = null
    if (building.hasComponent("WorkProgress")) {
        workProgress = building.getComponent("WorkProgress") as WorkProgressComponent;
    } else {
        workProgress = building.addComponent("WorkProgress") as WorkProgressComponent;
    }
    if (!workProgress) {
        log.info("工作进度组件不存在", building.getId());
        return null;
    }
    const progressData = workProgress.addWorkProgress(monsterId, workType, building.getId(), world.getCurrentVirtualTime());
    if (!progressData) {
        log.info("工作进度不存在", building.getId());
        return null;
    }
    const buildingPropertyComponent = building.getComponent("BuildingProperty") as BuildingPropertyComponent;
    progressData.endTime = new Date(progressData.startTime.getTime() + calculateWorkTime(buildingPropertyComponent, monsterProperty, workType));
    return workProgress;
}

function checkCanStartWork(monster: Monster, building: Building, workType: WorkType): boolean {
    const workConfig = WorkInfoConfig.get(workType);
    if (!workConfig) {
        return false;
    }

    if (!monster.hasComponent("MonsterProperty")) {
        return false;
    }

    const monsterPropertyComponent = monster.getComponent("MonsterProperty") as MonsterPropertyComponent;
    if (monsterPropertyComponent.status != PalStatus.Idle) {
        return false;
    }

    if (monsterPropertyComponent.baseProperty.level < workConfig.requiredLevel) {
        return false;
    }

    if (monsterPropertyComponent.workProperty.stamina < workConfig.stamminaCost) {
        return false;
    }

    const efficiency = getMonsterWorkEfficiency(monsterPropertyComponent.baseProperty.type, workType);
    if (efficiency === 0) {
        return false;
    }

    if (!hasAvailableWorkSlot(building, workType)) {
        return false;
    }

    return true;
}

export function processStopWork(world: World, avatarId: number, buildingId: number, monsterId: number, isComplete: boolean = false): boolean {
    const building = world.getEntitiesManager().getEntity(buildingId) as Building;
    if (!building) {
        log.info("建筑不存在", buildingId);
        return false;
    }

    const avatar = world.getEntitiesManager().getEntity(avatarId) as Avatar;
    if (!avatar) {
        log.info("avatar不存在", avatarId);
        return false;
    }

    const monster = world.getEntitiesManager().getEntity(monsterId) as Monster;
    if (!monster) {
        log.info("怪物不存在", monsterId);
        return false;
    }

    if (!monster.hasComponent("MonsterProperty")) {
        log.info("怪物没有MonsterProperty组件", monsterId);
        return false;
    }
    const monsterPropertyComponent = monster.getComponent("MonsterProperty") as MonsterPropertyComponent;
    const workType = monsterPropertyComponent.workProperty.currentWorkType;

    // todo: 怪物数值变化可以抽象出来
    if (isComplete) {
        const workConfig = WorkInfoConfig.get(workType);
        if (!workConfig) {
            log.info("工作配置不存在", workType);
            return false;
        }
        const baseExp = Math.round(workConfig.baseTime / 10);
        monsterPropertyComponent.onFinishWork(baseExp, workConfig.stamminaCost);
    }

    monsterPropertyComponent.stopWork();

    const buildingPropertyComponent = building.getComponent("BuildingProperty") as BuildingPropertyComponent;
    buildingPropertyComponent.removeWorkers(monsterId);

    if (building.hasComponent("WorkProgress")) {
        const workProgress = building.getComponent("WorkProgress") as WorkProgressComponent;
        workProgress.removeWorkProgress(monsterId);
        if (workProgress.getWorkProgressList().length == 0) {
            building.removeComponent("WorkProgress");
        }
    }
    return true;
}

export function processStartRest(world: World, avatarId: number, buildingId: number, monsterId: number): boolean {
    const building = world.getEntitiesManager().getEntity(buildingId) as Building;
    if (!building) {
        log.info("建筑不存在", buildingId);
        return false;
    }

    const avatar = world.getEntitiesManager().getEntity(avatarId) as Avatar;
    if (!avatar) {
        log.info("avatar不存在", avatarId);
        return false;
    }

    const monster = world.getEntitiesManager().getEntity(monsterId) as Monster;
    if (!monster) {
        log.info("怪物不存在", monsterId);
        return false;
    }

    // todo:暂时服用，后面将休息逻辑独立出来
    if (!checkCanStartWork(monster, building, WorkType.Rest)) {
        return false;
    }

    // 暂时复用
    const buildingPropertyComponent = building.getComponent("BuildingProperty") as BuildingPropertyComponent;
    buildingPropertyComponent.addWorkers(monsterId);

    const monsterPropertyComponent = monster.getComponent("MonsterProperty") as MonsterPropertyComponent;
    monsterPropertyComponent.startRest(buildingId, world.getCurrentVirtualTime());

    createRestProgress(world, building, monsterId, monsterPropertyComponent.baseProperty);
    return true;
}

function createRestProgress(world: World, building: Building, monsterId: number, monsterProperty: MonsterBaseProperty): RestProgressComponent | null {
    let restProgress = null
    if (building.hasComponent("RestProgress")) {
        restProgress = building.getComponent("RestProgress") as RestProgressComponent;
    } else {
        restProgress = building.addComponent("RestProgress") as RestProgressComponent;
    }
    if (!restProgress) {
        log.info("休息进度组件不存在", building.getId());
        return null;
    }
    const progressData = restProgress.addRestProgress(monsterId, building.getId(), world.getCurrentVirtualTime());
    if (!progressData) {
        log.info("休息进度不存在", building.getId());
        return null;
    }
    const buildingPropertyComponent = building.getComponent("BuildingProperty") as BuildingPropertyComponent;
    progressData.endTime = new Date(progressData.startTime.getTime() + calculateWorkTime(buildingPropertyComponent, monsterProperty, WorkType.Rest));
    return restProgress;
}

export function processStopRest(world: World, avatarId: number, buildingId: number, monsterId: number, isComplete: boolean = false): boolean {
    const building = world.getEntitiesManager().getEntity(buildingId) as Building;
    if (!building) {
        log.info("建筑不存在", buildingId);
        return false;
    }

    const avatar = world.getEntitiesManager().getEntity(avatarId) as Avatar;
    if (!avatar) {
        log.info("avatar不存在", avatarId);
        return false;
    }

    const monster = world.getEntitiesManager().getEntity(monsterId) as Monster;
    if (!monster) {
        log.info("怪物不存在", monsterId);
        return false;
    }

    if (!monster.hasComponent("MonsterProperty")) {
        log.info("怪物没有MonsterProperty组件", monsterId);
        return false;
    }
    const monsterPropertyComponent = monster.getComponent("MonsterProperty") as MonsterPropertyComponent;

    monsterPropertyComponent.stopRest();

    const buildingPropertyComponent = building.getComponent("BuildingProperty") as BuildingPropertyComponent;
    buildingPropertyComponent.removeWorkers(monsterId);

    if (building.hasComponent("RestProgress")) {
        const restProgress = building.getComponent("RestProgress") as RestProgressComponent;
        restProgress.removeRestProgress(monsterId);
        if (restProgress.getRestProgressList().length == 0) {
            building.removeComponent("RestProgress");
        }
    }
    return true;
}