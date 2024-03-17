import {_decorator, Component, EventMouse, Animation, Input, input, log, Node, Vec3} from 'cc';

const {ccclass, property} = _decorator;

/**
 * 小方块的大小
 */
export const BLOCK_SIZE = 40;

@ccclass('NewComponent')
export class NewComponent extends Component {
    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _curJumpTime: number = 0;
    private _jumpTime: number = 0.1;
    private _curJumpSpeed: number = 0;
    private _curPos: Vec3 = new Vec3();
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    private _targetPos: Vec3 = new Vec3();

    /**
     * 东海组件
     */
    @property(Animation)
    BodyAnim: Animation = null;

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this)
    }

    update(deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime; // 累加跳跃时间
            if (this._curJumpTime > this._jumpTime) { // 当跳跃时间是否结束  
                // node 是当前组件被附加到的一个节点，在此类中，表示 玩家控制的角色
                this.node.setPosition(this._targetPos);
                this._startJump = false; // 将跳跃标记清掉
            } else {
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._curJumpSpeed * deltaTime; //每一帧根据速度和时间计算位移
                Vec3.add(this._curPos, this._curPos, this._deltaPos); // 应用这个位置
                this.node.setPosition(this._curPos); // 将位置设置给角色
            }
        }
    }

    /**
     * 监听鼠标时间
     * @param event 鼠标时间
     */
    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.jumpByStep(1);
            console.log("处理的左键点击中");
        } else if (event.getButton() === 2) {
            this.jumpByStep(2);
        }
    }

    /**
     * 跳跃步数
     * @param step
     */
    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true;
        this._jumpStep = step; // 跳跃步数
        this._curJumpTime = 0;

        const state = this.BodyAnim.getState(step == 1 ? 'oneStep' : 'twoStep');
        this._jumpTime = state.duration;// 将跳跃时间改为当前跳跃动画的耗时
        console.log("跳跃时长是：" + this._jumpTime);

        this._curJumpSpeed = this._jumpStep * BLOCK_SIZE / this._jumpTime; // 计算速度
        this.node.getPosition(this._curPos) // 当前角色的位置
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep * BLOCK_SIZE, 0, 0)); // 计算出新的目标位置

        if (this.BodyAnim) {
            if (step === 1) {
                this.BodyAnim.play('oneStep')
            } else if (step === 2) {
                this.BodyAnim.play('twoStep')
            }
        }

    }


}




