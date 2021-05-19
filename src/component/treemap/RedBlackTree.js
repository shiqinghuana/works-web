import React, {Component} from 'react';

import {Stage, Layer, Rect, Text} from 'react-konva';

import {Circle} from "react-konva";
import {Arrow} from "react-konva";
import {Button} from "antd";
import {Input} from "antd";
import {Space} from "antd";
import {InputNumber} from "antd";

import {Tooltip} from "antd";
import {Treemap} from "./TreeMap";
import {message} from "antd";

// 绘制圆形及文案
// 文案为 矩形，左上角坐标为圆心坐标减去半斤，
// 经试验  x向下偏移3px
// y坐标上浮 5px 效果最佳
/**
 * x 行 对应纵坐标  长度
 * y 列 对应横坐标长度
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Circles(props) {
    const {r, x, y, text, color} = props

    const s = "00000"+Math.abs(text);

    const s1 =  text>=0?s.substring(s.length-5,s.length):"-"+s.substring(s.length-4,s.length)

    return (
        <React.Fragment>
            <Circle radius={r} x={y} y={x} fill={color}/>
            <Text text={s1} x={y - r + 3} y={x - 5} fill={"white"}/>
        </React.Fragment>
    )
}

/**
 * 绘制箭头图像，根据两个圆的圆心坐标，计算出直线与圆交点处的坐标
 * 作为箭头的起始坐标
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function ArrowsRight(props) {

    const {r, x, y, x1, y1} = props
    let x2, y2, x3, y3; // 箭头指向下方球的坐标 根据相似三角形等比计算
    if (x1) {
        let b = (x1 - x) / (y1 - y)
        let char = Math.sqrt(r * r / (b + 1))
        x2 = y+char
        y2 = x+b*char
        x3 = y1-char
        y3 = x1 - b*char
    }
    return (
        <Arrow points={[x2, y2, x3, y3]} strokeWidth={1}
               lineCap={"round"}
               pointerLength={5}
               pointerWidth={5}
               fill={"black"} stroke={"black"}
        />
        )
}


function ArrowsLeft(props) {
    debugger;
    const {r, x, y, x1, y1} = props
    let x2, y2, x3, y3; // 箭头指向下方球的坐标 根据相似三角形等比计算
    if (x1) {
        let b = (x1-x ) / (y - y1)
        let char = Math.sqrt(r * r / (b + 1))
        x2 = y-char
        y2 = x+b*char
        x3 = y1+char
        y3 = x1 - b*char
    }
    return (
        <Arrow points={[x2, y2, x3, y3]} strokeWidth={1}
               lineCap={"round"}
               pointerLength={5}
               pointerWidth={5}
               fill={"black"} stroke={"black"}
        />
    )
}


// 适配1500*900 屏幕 横向最大30*50 纵向17*50 半径固定20 横纵间距固定10


export default class RedBlack extends Component {
    constructor() {
        super();
        this.state = {
            r: 20,// 圆的半径
            px: 50,
            treeMap: new Treemap(),
        }
    }

    /**
     * 只要key，value都是undefined
     * 直接调用treemap中的put方法
     * @param value
     */
    put = (value) => {
        if (!value) {
            message.warning("请输入数字")
            return
        }
        if (this.state.treeMap.get(value)){
            message.warning(value+"已存在")
            return
        }
        this.setState((state) =>{
            state.treeMap.put(value);
            return state;
        } )
    }

    get = (key)=>{
        if (!key) {
            message.warning("请输入数字")
            return
        }

         this.state.treeMap.get(key)?message.success("存在key:"+key) :message.error("不存在key:"+key)
    }

    remove = (key)=>{
        if (!key) {
            message.warning("请输入数字")
            return
        }
        if (!this.state.treeMap.get(key)){
            message.warning(key+"不存在,请确认")
            return
        }
        this.setState((state)=>{
            state.treeMap.remove(key)
            return state
        })
}
    /**
     * 计算出需要渲染的dom数组
     * @param treeHeight 树高固定5
     */
    dom = (treeHeight = 5)=>{
        debugger
        let sequences = this.state.treeMap.sequence(treeHeight); // 拿到层序遍历的二维数组
        if (!sequences){return }
        let doms = []
        for (const sequence of sequences) {
            for (const node of sequence) {

                doms.push(<Circles key={doms.length} r={this.state.r}
                                    x={node.offSet[0]*this.state.px}
                                    y={node.offSet[1]*this.state.px}
                                    text={node.key}
                                    color={node.color?"black":"red"}
                />)
                node.leftArrowOffSet && doms.push(
                    <ArrowsLeft
                        key={doms.length}
                        r={this.state.r}
                        x={node.offSet[0]*this.state.px}
                        y={node.offSet[1]*this.state.px}
                        x1={node.leftArrowOffSet[0]*this.state.px}
                        y1={node.leftArrowOffSet[1]*this.state.px}
                    />
                )

                node.rightArrowOffSet && doms.push(
                    <ArrowsRight
                        key={doms.length}
                        r={this.state.r}
                        x={node.offSet[0]*this.state.px}
                        y={node.offSet[1]*this.state.px}
                        x1={node.rightArrowOffSet[0]*this.state.px}
                        y1={node.rightArrowOffSet[1]*this.state.px}
                    />
                )
            }

        }
        console.log(doms)
        return doms
    }



    render() {
        return (
            <React.Fragment>
                <Space>
                    <InputNumber max={99999} min={-9999} ref={this.insert = React.createRef()}/>
                    <Tooltip title={"为了布局展示优美，输入长度不要超过5位,总节点不多于31"}>
                        <Button type={"primary"} onClick={() => this.put(this.insert.current.value)}> 添加</Button>
                    </Tooltip>

                    <InputNumber max={99999} min={-9999} ref={this.delete = React.createRef()}/>
                    <Button type={"primary"} onClick={() => this.remove(this.delete.current.value)}> 删除</Button>

                    <InputNumber max={99999} min={-9999} ref={this.find = React.createRef()}/>
                    <Button type={"primary"} onClick={() => this.get(this.find.current.value)}> 查找</Button>

                </Space>

                <div style={{height: "100%", width: "100%", border: "solid 1px"}}>

                    <Stage width={1500} height={900}>
                        <Layer draggable>
                            {this.dom()}
                        </Layer>
                    </Stage>

                </div>
            </React.Fragment>


        )
    }


}