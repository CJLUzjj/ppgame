import { System, SystemType } from "../../Infra/Decorators/SystemDecorator";
import { World } from "../../Infra/World";
import { BaseExcuteSystem } from "../../Infra/Base/System/BaseExcuteSystem";
import { BaseEntity } from "../../Infra/Base/BaseEntity";
import { processStartRest, processStopRest } from "../../Utility/Work/Common";
import { MessageComponent } from "../../Component/Input/MessageComponent";
import { MessageParams, MessageType } from "../../Interface/Common/MessageId";
import { log } from "../../Interface/Service/LogService";

// 目前是专属于建筑的一个system
@System(SystemType.Execute)
export class RestOperateSystem extends BaseExcuteSystem {
    constructor(world: World) {
        super(world);
        this.name = "RestOperate";
        this.prevSystemsName = [];
        this.focusComponent = ["Message"];
    }

    execute(entities: BaseEntity[]) {
        for (const entity of entities) {
            const messageComponent = entity.getComponent("Message") as MessageComponent;
            if (messageComponent) {
                this.processRestStartRequest(messageComponent);
                this.processRestStopRequest(messageComponent);
            }
        }
    }

    processRestStartRequest(messageComponent: MessageComponent) {
        while (true) {
            const message = messageComponent.popMessage(MessageType.START_REST);
            if (!message) {
                break;
            }
            const params = message.args as MessageParams[MessageType.START_REST];
            if (!processStartRest(this.world, params.avatarId, params.buildingId, params.monsterId)) {
                log.info("休息开始失败", params.avatarId, params.buildingId, params.monsterId);
            }
        }
    }

    processRestStopRequest(messageComponent: MessageComponent) {
        while (true) {
            const message = messageComponent.popMessage(MessageType.STOP_REST);
            if (!message) {
                break;
            }
            const params = message.args as MessageParams[MessageType.STOP_REST];
            if (!processStopRest(this.world, params.avatarId, params.buildingId, params.monsterId)) {
                log.info("休息停止失败", params.avatarId, params.buildingId, params.monsterId);
            }
        }
    }
}