import {_decorator, CCInteger, Component, instantiate, Node, Prefab} from 'cc';
import {BLOCK_SIZE} from "db://assets/Scripts/PlayerController";

const {ccclass, property} = _decorator;


enum BlockType {
    // 坑
    BT_NONE,
    // 小方块
    BT_TONE,
}

@ccclass('GameManager')
export class GameManager extends Component {

    /**
     * 道路小方块属性
     */
    @property({type: Prefab})
    public boxPrefab: Prefab | null = null;
    @property({type: CCInteger})
    public roadLength: number = 50;

    private _road: BlockType[] = [];


    start() {
        this.generateRoad();
    }

    update(dt: number) {

    }

    generateRoad() {
        // 创建路之前，先要移除所有的子元素
        this.node.removeAllChildren();
        // 第一个方块必须是石头
        this._road.push(BlockType.BT_NONE)

        // 创建数组
        for (let i = 1; i < this.roadLength; i++) {
            // 如果前面一个和前面2个都是坑，那么这一个必须是石头了
            if (i > 1
                && this._road[i - 1] === BlockType.BT_NONE
                && this._road[i - 2] === BlockType.BT_NONE) {
                this._road.push(BlockType.BT_TONE);
            } else {
                this._road.push(Math.floor(Math.random() * 2));
            }
        }

        // 遍历数组以初始化道路
        for (let i = 0; i < this.roadLength; i++) {
            let block: Node | null = this.spawnBlockByType(this._road[i]);
            if (block) {
                this.node.addChild(block);
                block.setPosition(i * BLOCK_SIZE, 0, 0);
            }

        }


    }

    /**
     * 按照道路初始化
     * @param blockType 小方块类型
     * @private
     */
    private spawnBlockByType(type: BlockType) {
        // 如果是空的直接返回吧
        if (!this.boxPrefab) {
            return null;
        }
        let block: Node | null = null;
        if (type == BlockType.BT_TONE) {
            block = block = instantiate(this.boxPrefab);
        }
        // switch (type) {
        //     case BlockType.BT_STONE:
        //         block = instantiate(this.boxPrefab);
        //         break;
        // }
        return block;
    }
}


