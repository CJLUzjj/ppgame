import { Node2D } from "godot";
import { globalMainScene } from "./main";
import { log } from "../../../core/Interface/Service/LogService";
import { SyncCallback } from "../service/syncService";
import { instantiate_asset } from "../common/instantiation";
import { BaseComponent } from "../../../core/Infra/Base/BaseComponent";

const kRoomSpacePath = "res://src/engine/platform/godot/sence/room_space.tscn";

export default class RoomSpace extends Node2D {
	private entityId: number = 0;

	// Called when the node enters the scene tree for the first time.
	_ready(): void {

	}

	// Called every frame. 'delta' is the elapsed time since the previous frame.
	_process(delta: number): void {
	}

	setEntityId(entityId: number): void {
		this.entityId = entityId;
	}

	onComponentChanged(component: BaseComponent): void {
		log.info("RoomSpace onComponentChanged", component.getComponentName());
	}

	static createSence(entityId: number, component: BaseComponent): SyncCallback {
		log.info("createSence", entityId, component);
		
		if (globalMainScene == null) {
			log.error("globalMainScene is null");
			return new SyncCallback();
		}
	
		const node = <RoomSpace><unknown>instantiate_asset(kRoomSpacePath, globalMainScene)
		node.setEntityId(entityId);
	
		// 根据component的属性，设置node的属性
	
		const syncCallback = new SyncCallback();
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
