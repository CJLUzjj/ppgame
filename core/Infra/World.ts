import { EntitiesManager } from "./EntitiesManager";
import { SystemsManager } from "./SystemsManager";
import { log } from "../Interface/Service/LogService";

export class World {
    // 用于创建单例component
    private static defaultWorld: World;
    private static worldIdGenerator: number = 1;
    private systemsManager: SystemsManager;
    private entitiesManager: EntitiesManager;
    private isStart: boolean;
    private currentVirtualTime: number;
    private id: number;

    constructor(id: number) {
        this.id = id;
        this.systemsManager = new SystemsManager(this);
        this.entitiesManager = new EntitiesManager(this);
        this.isStart = false;
        this.currentVirtualTime = 0;
    }

    public start(): void {
        SystemsManager.registerSystems(this);
        this.systemsManager.start();
        this.isStart = true;
        
        // 输出系统注册统计信息
        const stats = this.systemsManager.getSystemsStats();
        log.info("世界启动完成，系统统计信息:", stats);
    }

    public stop(): void {
        this.isStart = false;
    }

    public tick(deltaTime: number): void {
        this.currentVirtualTime += deltaTime;
        if (!this.isStart) {
            return;
        }
        this.systemsManager.tick();
        this.entitiesManager.tick();
    }

    public getSystemsManager(): SystemsManager {
        return this.systemsManager;
    }

    public getEntitiesManager(): EntitiesManager {
        return this.entitiesManager;
    }

    public getCurrentVirtualTime(): number {
        return this.currentVirtualTime;
    }

    public getId(): number {
        return this.id;
    }

    static getDefaultWorld(): World {
        if (!this.defaultWorld) {
            this.defaultWorld = new World(0);
        }
        return this.defaultWorld;
    }

    static getWorldId(): number {
        return this.worldIdGenerator;
    }

    static setWorldId(id: number) {
        this.worldIdGenerator = id;
    }

    serialize(): Record<string, any> {
        const serializationData = {
            id: this.id,
            currentVirtualTime: this.currentVirtualTime,
            entities: {} as Record<string, any>,
        }

        serializationData.entities = this.entitiesManager.serialize();
        return serializationData;
    }

    deserialize(data: Record<string, any>) {
        try {
            const serializationData = data;
            this.id = serializationData.id;
            this.currentVirtualTime = serializationData.currentVirtualTime;
            this.entitiesManager.deserialize(serializationData.entities);
        } catch (error) {
            console.error('反序列化Entity时发生错误:', error);
            throw new Error(`反序列化失败: ${error}`);
        }
    }
}