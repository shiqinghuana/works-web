const RED = false;
const BLACK = true;

// 数据结构
class Entry {
    key;
    value;
    left;
    right;
    parent;
    color = BLACK;

    /**
     * Make a new cell with given key, value, and parent, and with
     * {@code null} child links, and BLACK color.
     */
    constructor(key, value, parent) {
        this.key = key;
        this.value = value;
        this.parent = parent;
    }

    /**
     * Returns the key.
     *
     * @return the key
     */
    getKey() {
        return this.key;
    }


    getValue() {
        return this.value;
    }


    setValue(value) {
        let oldValue = this.value;
        this.value = value;
        return oldValue;
    }


}

// 红黑树的实现类
export default class Treemap {
    constructor(root =null,next =null,comparator = null) {
        this.comparator = comparator;
        this.root = root; // 初始化值
        this.size = 0; // 这个size用于记录节点值。用于渲染画布大小
        this.next = next;
    }

    // 插入后平衡
    fixAfterInsertion = (x) => {
        x.color = RED;
        // 如果 爸爸是红色且自己不是根节点则开始平衡
        while (x != null && x !== this.root && x.parent.color === RED) {
            if (this.parentOf(x) === this.leftOf(this.parentOf(this.parentOf(x)))) {
                // 如果爸爸 是 爷爷的左孩子
                // 拿到右孩子的节点 ---叔叔
                let y = this.rightOf(this.parentOf(this.parentOf(x)));

                // 如果叔叔是红色的，说明爷爷是黑色的，交换颜色
                if (this.colorOf(y) === RED) {
                    this.setColor(this.parentOf(x), BLACK);
                    this.setColor(y, BLACK);
                    this.setColor(this.parentOf(this.parentOf(x)), RED);
                    x = this.parentOf(this.parentOf(x));
                } else {// 如果叔叔是黑色的
                    //如果自己是右孩子
                    if (x === this.rightOf(this.parentOf(x))) {
                        // 对爸爸进行左旋一次
                        x = this.parentOf(x);
                        this.rotateLeft(x);
                    }

                    this.setColor(this.parentOf(x), BLACK);
                    this.setColor(this.parentOf(this.parentOf(x)), RED);
                    // 对爷爷进行一次右旋
                    this.rotateRight(this.parentOf(this.parentOf(x)));
                }
            } else {
                // 爸爸是爷爷的右孩子，拿到左侧的叔叔节点
                let y = this.leftOf(this.parentOf(this.parentOf(x)));
                // 如果叔叔是红色的，啥都不用做，交换爸爸，叔叔，爷爷的颜色
                if (this.colorOf(y) === RED) {
                    this.setColor(this.parentOf(x), BLACK);
                    this.setColor(y, BLACK);
                    this.setColor(this.parentOf(this.parentOf(x)), RED);
                    x = this.parentOf(this.parentOf(x));
                } else {
                    // 如果叔叔是黑的的
                    // 如果自己是爸爸的左界定啊
                    if (x === this.leftOf(this.parentOf(x))) {
                        x = this.parentOf(x);
                        // 对爸爸进行一次右旋
                        this.rotateRight(x);
                    }
                    this.setColor(this.parentOf(x), BLACK);
                    this.setColor(this.parentOf(this.parentOf(x)), RED);
                    // 对爷爷进行一次左旋
                    this.rotateLeft(this.parentOf(this.parentOf(x)));
                }
            }
        }
        this.root.color = BLACK;
    }

    put = (key, value) => {
        let t = this.root;
        if (t === null) {
            this.root = new Entry(key, value, null);
            this.size = 1;
            return null;
        }
        let cmp;
        let parent;
        // split comparator and comparable paths
        let cpr = this.comparator;
        if (cpr != null) {
            do {
                parent = t;
                cmp = cpr.compare(key, t.key);
                if (cmp < 0)
                    t = t.left;
                else if (cmp > 0)
                    t = t.right;
                else
                    return t.setValue(value);
            } while (t != null);
        } else {
            if (key == null)
                throw new Error();
            let k = key;
            do {
                parent = t;
                // 这里做比较，只支持int类型
                cmp = k - (t.key);
                if (cmp < 0)
                    t = t.left;
                else if (cmp > 0)
                    t = t.right;
                else
                    return t.setValue(value);
            } while (t != null);
        }
        let e = new Entry(key, value, parent);
        if (cmp < 0)
            parent.left = e;
        else
            parent.right = e;
        this.fixAfterInsertion(e);
        this.size++;

        return null;

    }

    get = (key, k = this.root) => {
        debugger
        if (!k) {
            return false;
        }
        if (k.key === key) {
            return true;
        }
        if (k.key - key>0) {
            return this.get(key, k.left || false)
        }
        return this.get(key, k.right || false)
    }

    rotateLeft = (p) => {
        if (p != null) {
            let r = p.right;
            p.right = r.left;
            if (r.left != null)
                r.left.parent = p;
            r.parent = p.parent;
            if (p.parent == null)
                this.root = r;
            else if (p.parent.left === p)
                p.parent.left = r;
            else
                p.parent.right = r;
            r.left = p;
            p.parent = r;
        }
    }

    rotateRight = (p) => {
        if (p !== null) {
            let l = p.left;
            p.left = l.right;
            if (l.right != null) l.right.parent = p;
            l.parent = p.parent;
            if (p.parent == null)
                this.root = l;
            else if (p.parent.right === p)
                p.parent.right = l;
            else p.parent.left = l;
            l.right = p;
            p.parent = l;
        }
    }

    colorOf = (p) => {
        return (p == null ? BLACK : p.color);
    }

    parentOf = (p) => {
        return (p == null ? null : p.parent);
    }

    setColor = (p, c) => {
        if (p != null)
            p.color = c;
    }

    leftOf = (p) => {
        return (p == null) ? null : p.left;
    }

    rightOf = (p) => {
        return (p == null) ? null : p.right;
    }


    /**
     * 二叉树的层序遍历，这里要确定好每个节点的 row col 坐标
     * 以及确定 leftArrow rightArrow 是否要 渲染
     * 默认更节点行列坐标 [0,0]
     * @param treeHeight 树最高层数
     * 公式。以root为节点
     * root 列坐标 为 2^(treeHeight-1) 这里要不要-1 看效果，如果以0开头，就减1
     * 子节点坐标以父节点为参考
     * 左节点 prentCol - 2^(treeHeight-row)
     *  右节点 prentCol + 2^(treeHeight-row)
     *
     * @returns {[]}
     */
    sequence = (treeHeight) => {
        if (this.root === null) {
            return
        }
        this.root.offSet = [1, Math.pow(2, treeHeight - 1)]
        // 重置，解决删除的时候会保留箭头的bug
        this.root.leftArrowOffSet = null
        this.root.rightArrowOffSet = null
        let result = []; // 返回结果集合 fix bug
        let sequences = [this.root]; // 每一层的集合
        let e = [], left, right, prent;

        while (sequences.length > 0 || e.length > 0) {
            for (let i = 0; i < sequences.length; i++) {

                prent = sequences[i]
                let [X, Y] = prent.offSet
                if ((left = prent.left)) {
                    left.offSet = [X + 1, Y - Math.pow(2, treeHeight - X - 1)] // 根据父节点计算出子节点坐标
                    prent.leftArrowOffSet = left.offSet // 左像箭头坐标
                    left.leftArrowOffSet = null
                    left.rightArrowOffSet = null
                    e.push(left)
                }
                if ((right = prent.right)) {
                    right.offSet = [X + 1, Y + Math.pow(2, treeHeight - X - 1)]
                    prent.rightArrowOffSet = right.offSet // 右向箭头坐标
                    right.leftArrowOffSet = null
                    right.rightArrowOffSet = null
                    e.push(right)
                }
            }
            let copy = [...sequences] // 此处要做拷贝，直接push是引用
            result.push(copy)
            sequences = e;
            e = []
        }
        return result;
    }

    deleteEntry = (p) => {
        this.size--;
        // If strictly internal, copy successor's element to p and then make p
        // point to successor.
        if (p.left != null && p.right != null) {
            let s = this.successor(p);
            p.key = s.key;
            p.value = s.value;
            p = s;
        } // p has 2 children

// Start fixup at replacement node, if it exists.
        let replacement = (p.left != null ? p.left : p.right);

        if (replacement != null) {
            // Link replacement to parent
            replacement.parent = p.parent;
            if (p.parent == null)
                this.root = replacement;
            else if (p === p.parent.left)
                p.parent.left = replacement;
            else
                p.parent.right = replacement;
            // Null out links so they are OK to use by fixAfterDeletion.
            p.left = p.right = p.parent = null;
            // Fix replacement
            if (p.color === BLACK)
                this.fixAfterDeletion(replacement);
        } else if (p.parent == null) { // return if we are the only node.
            this.root = null;
        } else { //  No children. Use self as phantom replacement and unlink.
            if (p.color === BLACK)
                this.fixAfterDeletion(p);
            if (p.parent != null) {
                if (p === p.parent.left)
                    p.parent.left = null;
                else if (p === p.parent.right)
                    p.parent.right = null;
                p.parent = null;
            }
        }
    }


    fixAfterDeletion = (x) => {
        while (x !== this.root && this.colorOf(x) === BLACK) {
            if (x === this.leftOf(this.parentOf(x))) {
                let sib = this.rightOf(this.parentOf(x));

                if (this.colorOf(sib) === RED) {
                    this.setColor(sib, BLACK);
                    this.setColor(this.parentOf(x), RED);
                    this.rotateLeft(this.parentOf(x));
                    sib = this.rightOf(this.parentOf(x));
                }

                if (this.colorOf(this.leftOf(sib)) === BLACK &&
                    this.colorOf(this.rightOf(sib)) === BLACK) {
                    this.setColor(sib, RED);
                    x = this.parentOf(x);
                } else {
                    if (this.colorOf(this.rightOf(sib)) === BLACK) {
                        this.setColor(this.leftOf(sib), BLACK);
                        this.setColor(sib, RED);
                        this.rotateRight(sib);
                        sib = this.rightOf(this.parentOf(x));
                    }
                    this.setColor(sib, this.colorOf(this.parentOf(x)));
                    this.setColor(this.parentOf(x), BLACK);
                    this.setColor(this.rightOf(sib), BLACK);
                    this.rotateLeft(this.parentOf(x));
                    x = this.root;
                }
            } else { // symmetric
                let sib = this.leftOf(this.parentOf(x));

                if (this.colorOf(sib) === RED) {
                    this.setColor(sib, BLACK);
                    this.setColor(this.parentOf(x), RED);
                    this.rotateRight(this.parentOf(x));
                    sib = this.leftOf(this.parentOf(x));
                }

                if (this.colorOf(this.rightOf(sib)) === BLACK &&
                    this.colorOf(this.leftOf(sib)) === BLACK) {
                    this.setColor(sib, RED);
                    x = this.parentOf(x);
                } else {
                    if (this.colorOf(this.leftOf(sib)) === BLACK) {
                        this.setColor(this.rightOf(sib), BLACK);
                        this.setColor(sib, RED);
                        this.rotateLeft(sib);
                        sib = this.leftOf(this.parentOf(x));
                    }
                    this.setColor(sib, this.colorOf(this.parentOf(x)));
                    this.setColor(this.parentOf(x), BLACK);
                    this.setColor(this.leftOf(sib), BLACK);
                    this.rotateRight(this.parentOf(x));
                    x = this.root;
                }
            }
        }
        this.setColor(x, BLACK);
    }

    successor = (t) => {
        if (t == null)
            return null;
        else if (t.right != null) {
            let p = t.right;
            while (p.left != null)
                p = p.left;
            return p;
        } else {
            let p = t.parent;
            let ch = t;
            while (p != null && ch === p.right) {
                ch = p;
                p = p.parent;
            }
            return p;
        }
    }


    remove = (key) => {
        let p = this.getEntry(key);
        if (p == null) {
            return null;
        }
        let oldValue = p.value;
        this.deleteEntry(p);
        return oldValue;
    }

    getEntry = (key) => {
        // Offload comparator-based version for sake of performance
        if (key == null) {
            return null;
        }
        let k = key;
        let p = this.root;
        while (p != null) {
            let cmp = k - (p.key);
            if (cmp < 0) {
                p = p.left;
            } else if (cmp > 0) {
                p = p.right;
            } else {
                return p;
            }
        }
        return null;
    }



}



