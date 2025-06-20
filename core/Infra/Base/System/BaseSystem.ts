import { EntitiesManager } from "../../EntitiesManager";
import { World } from "../../World";
import { BaseEntity } from "../BaseEntity";

export abstract class BaseSystem {
    name: string;
    focusComponent: string[];
    prevSystemsName: string[];
    world: World;

    constructor(world: World) {
        this.name = this.constructor.name;
        this.focusComponent = [];
        this.prevSystemsName = [];
        this.world = world;
    }

    addPrevSystem(system: BaseSystem): void {
        this.prevSystemsName.push(system.name);
    }

    addFocusComponent(component: string): void {
        this.focusComponent.push(component);
    }

    getEntities(): BaseEntity[] {
        return this.world.getEntitiesManager().getEntitiesWithComponents(this.world, this.focusComponent);
    }
}
