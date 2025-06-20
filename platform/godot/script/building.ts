import { BaseComponent } from "../../../core/Infra/Base/BaseComponent";
import { Node2D, Vector2, Sprite2D } from "godot";
import { log } from "../../../core/Interface/Service/LogService";
import { globalMainScene } from "./main";
import { SyncCallback } from "../service/syncService";
import { instantiate_asset } from "../common/instantiation";
import { PositionComponent } from "../../../core/Component/PositionComponent";

const kBuildingPath = "res://src/engine/platform/godot/sence/building.tscn";

export default class Building extends Sprite2D {
	private entityId: number = 0;
	private _cached_pos!: Vector2;
	// Called when the node enters the scene tree for the first time.
	_ready(): void {
		this._cached_pos = new Vector2();
	}

	// Called every frame. 'delta' is the elapsed time since the previous frame.
	_process(delta: number): void {
	}

	onComponentChanged(component: BaseComponent): void {
		log.info("Building onComponentChanged", component.getComponentName());
		if (component.getComponentName() == "Position") {
			const positionComponent = component as PositionComponent;
			log.info("Building onComponentChanged Position", positionComponent.getPosition().x, positionComponent.getPosition().y);
			this._cached_pos.x = positionComponent.getPosition().x;
			this._cached_pos.y = positionComponent.getPosition().y;
			this.updatePosition();
		}
	}

	onComponentAdded(component: BaseComponent): void {
		log.info("Building onComponentAdded", component.getComponentName());
		if (component.getComponentName() == "Position") {
			const positionComponent = component as PositionComponent;
			log.info("Building onComponentAdded Position", positionComponent.getPosition().x, positionComponent.getPosition().y);
			this.position.x = positionComponent.getPosition().x;
			this.position.y = positionComponent.getPosition().y;
			this.updatePosition();
		}
	}

	updatePosition(): void {
		this.position = this._cached_pos;
		log.info("updatePosition", this.position.x, this.position.y);
	}

	setEntityId(entityId: number): void {
		this.entityId = entityId;
	}

	static createSence(entityId: number, component: BaseComponent): SyncCallback {
		log.info("createSence", entityId, component);
		if (globalMainScene == null) {
			log.error("globalMainScene is null");
			return new SyncCallback();
		}

		const node = <Building><unknown>instantiate_asset(kBuildingPath, globalMainScene)
		node.setEntityId(entityId);

		const syncCallback = new SyncCallback();

		syncCallback.addCallback = (component: BaseComponent) => {
			node.onComponentAdded(component);
		}

		syncCallback.syncCallback = (component: BaseComponent) => {
			node.onComponentChanged(component);
		}
	
		syncCallback.removeCallback = () => {
			if (globalMainScene != null) {
				globalMainScene.remove_child(node);
			}
		}
	
		return syncCallback;
	}
}
