import { BaseComponent } from "../../Infra/Base/BaseComponent";
import { Message } from "../../Interface/Service/MessageService";
import { BaseEntity } from "../../Infra/Base/BaseEntity";
import { RegisterComponent } from "../../Infra/ComponentRegistry";

@RegisterComponent("Message")
export class MessageComponent extends BaseComponent {
    private messageMap: Map<number, Message[]>;

    constructor(owner: BaseEntity) {
        super(owner, "Message");
        this.messageMap = new Map();
    }

    addMessage(message: Message) {
        const messageList = this.messageMap.get(message.id);
        if (!messageList) {
            this.messageMap.set(message.id, [message]);
        } else {
            messageList.push(message);
        }
    }

    popMessage(id: number): Message | null {
        const messageList = this.messageMap.get(id);
        if (!messageList) {
            return null;
        }
        return messageList.shift() || null;
    }
}