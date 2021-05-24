// import {Treemap} from "../treemap/TreeMap";


import Treemap from "../treemap/TreeMap";

const DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

/**
 * The maximum capacity, used if a higher value is implicitly specified
 * by either of the constructors with arguments.
 * MUST be a power of two <= 1<<30.
 */
const MAXIMUM_CAPACITY = 1 << 5;

/**
 * The load factor used when none specified in constructor.
 */
const DEFAULT_LOAD_FACTOR = 0.75;

/**
 * The bin count threshold for using a tree rather than list for a
 * bin.  Bins are converted to trees when adding an element to a
 * bin with at least this many nodes. The value must be greater
 * than 2 and should be at least 8 to mesh with assumptions in
 * tree removal about conversion back to plain bins upon
 * shrinkage.
 */
const TREEIFY_THRESHOLD = 8;

/**
 * The bin count threshold for untreeifying a (split) bin during a
 * resize operation. Should be less than TREEIFY_THRESHOLD, and at
 * most 6 to mesh with shrinkage detection under removal.
 */
const UNTREEIFY_THRESHOLD = 6;

/**
 * The smallest table capacity for which bins may be treeified.
 * (Otherwise the table is resized if too many nodes in a bin.)
 * Should be at least 4 * TREEIFY_THRESHOLD to avoid conflicts
 * between resizing and treeification thresholds.
 */
const MIN_TREEIFY_CAPACITY = 64;

/**
 * Basic hash bin node, used for most entries.  (See below for
 * TreeNode subclass, and in LinkedHashMap for its Entry subclass.)
 */
class Node {
    hash;
    key;
    value;
    next;

    constructor(hash, key, value, next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next
    }
}



// 此处只支持数字
function hash(key) {
    let h;
    return (key == null) ? 0 : (h = key) ^ (h >>> 16);
}


/**
 * Returns a power of two size for the given target capacity.
 */
function tableSizeFor(cap) {
    let n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}


export class HashMap {

    table;

    /**
     * Holds cached entrySet(). Note that AbstractMap fields are used
     * for keySet() and values().
     */
    entrySet;

    /**
     * The number of key-value mappings contained in this map.
     */
    size;

    /**
     * The number of times this HashMap has been structurally modified
     * Structural modifications are those that change the number of mappings in
     * the HashMap or otherwise modify its internal structure (e.g.,
     * rehash).  This field is used to make iterators on Collection-views of
     * the HashMap fail-fast.  (See ConcurrentModificationException).
     */
    modCount;

    /**
     * The next size value at which to resize (capacity * load factor).
     *
     * @serial
     */
        // (The javadoc description is true upon serialization.
        // Additionally, if the table array has not been allocated, this
        // field holds the initial array capacity, or zero signifying
        // DEFAULT_INITIAL_CAPACITY.)
    threshold;

    /**
     * The load factor for the hash table.
     *
     * @serial
     */
    loadFactor;

    constructor(loadFactor = DEFAULT_LOAD_FACTOR) {
        this.loadFactor = loadFactor
        this.modCount = 0;
        this.size = 0;

    }
    /**
     *  转成树。简单处理
     */
    treeifyBin(tab, hash) {
        let p, n = tab.left, i;
        p = tab[i = (n - 1) & hash]
        let treemap = new Treemap();
        while (p != null) {
            treemap.put(p.key, p.value)
            p = p.next;
        }
        tab[i] = treemap;
    }


    /**对树进行中序遍历*/
    midEach(root){
        if(!root){
            return []
        }
        return this.midEach(root.left).concat([root]).concat(this.midEach(root.right))
    }

    /**这里用于 resize时 将树打散 重置于 newTab 中，此处的 newTab 一定要传引用，不然无法更新到类变量 table中*/
    split(root,newTab,onlyIfAbsent=true){
        let array = this.midEach(root);
        for (const entry of array) {
            let tab, p, n, i,hash = hash(entry.key),key=entry.key,value = entry.value;
            if ((tab = newTab ) == null || (n = tab.length) === 0) {
                n = (tab = this.resize()).length;
            }
            if ((p = tab[i = (n - 1) & hash]) == null){
                tab[i] = this.newNode(hash, key, value, null);
            }

            else {
                let e, k;
                if (p.hash === hash && ((k = p.key) === key || (key != null && key.equals(k)))) {
                    e = p;
                } else if (p.constructor === Treemap)
                    e = (p).put(key, value);
                else {
                    for (let binCount = 0; ; ++binCount) {
                        if ((e = p.next) == null) {
                            p.next = this.newNode(hash, key, value, null);

                            /** 此处转成红黑树，直接复用 treemap代码 **/
                            if (binCount >= TREEIFY_THRESHOLD - 1) {
                                debugger;
                                this.treeifyBin(tab, hash);
                            } // -1 for 1st
                            break;
                        }
                        if (e.hash === hash &&
                            ((k = e.key) === key || (key != null && key.equals(k))))
                            break;
                        p = e;
                    }
                }
                if (e != null) { // existing mapping for key
                    let oldValue = e.value;
                    if (!onlyIfAbsent || oldValue == null)
                        e.value = value;

                    return oldValue;
                }
            }
            ++this.modCount;
            if (++this.size > this.threshold)
                this.resize();
            return null;
        }
    }

    get(key) {
        let e;
        return (e = this.getNode(hash(key), key)) == null ? null : e.value;
    }

    /**
     * Implements Map.get and related methods
     *
     * @param hash hash for key
     * @param key the key
     * @return the node, or null if none
     */
    getNode(hash, key) {
        let tab;
        let first, e;
        let n;
        let k;
        if ((tab = this.table) != null && (n = tab.length) > 0 &&
            (first = tab[(n - 1) & hash]) != null) {
            if (first.hash === hash && // always check first node
                ((k = first.key) === key || (key != null && key.equals(k))))
                return first;
            if ((e = first.next) != null) {
                if (first instanceof Treemap)
                    return first.get(key);
                do {
                    if (e.hash === hash &&
                        ((k = e.key) === key || (key != null && key.equals(k))))
                        return e;
                } while ((e = e.next) != null);
            }
        }
        return null;
    }

    put(key, value) {
        return this.putVal(hash(key), key, value, false, true);
    }

    putVal(hash, key, value, onlyIfAbsent, evict) {
        let tab, p, n, i;
        if ((tab = this.table) == null || (n = tab.length) === 0) {
            n = (tab = this.resize()).length;
        }

        if ((p = tab[i = (n - 1) & hash]) == null)
            tab[i] = this.newNode(hash, key, value, null);
        else {
            let e, k;
            if (p.hash === hash && ((k = p.key) === key || (key != null && key.equals(k)))) {
                e = p;
            } else if (p.constructor === Treemap)
                e = (p).put(key, value);
            else {
                for (let binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        p.next = this.newNode(hash, key, value, null);

                        /** 此处转成红黑树，直接复用 treemap代码 **/
                        if (binCount >= TREEIFY_THRESHOLD - 1) {
                            debugger;
                            this.treeifyBin(tab, hash);
                        } // -1 for 1st
                        break;
                    }
                    if (e.hash === hash &&
                        ((k = e.key) === key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            if (e != null) { // existing mapping for key
                let oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;

                return oldValue;
            }
        }
        ++this.modCount;
        if (++this.size > this.threshold)
            this.resize();
        return null;
    }

    /**
     * 模拟扩容。考虑到页面排版，最大支持table长度32
     * @returns {any[]|*}
     */

    resize() {
        let oldTab = this.table;
        let oldCap = (oldTab == null) ? 0 : oldTab.length;
        let oldThr = this.threshold;
        let newCap, newThr = 0;
        if (oldCap > 0) {
            // 最大支持到32
            if (oldCap >= MAXIMUM_CAPACITY) {
                this.threshold = MAXIMUM_CAPACITY;
                return oldTab;
                // 如果不到32 就翻一倍
            } else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&   oldCap >= DEFAULT_INITIAL_CAPACITY){
                newThr = oldThr << 1; // 翻一倍
            }
        } else if (oldThr > 0) {
            newCap = oldThr;
        }
        else {               // zero initial threshold signifies using defaults
            newCap = DEFAULT_INITIAL_CAPACITY;
            newThr = DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY;
        }
        if (newThr === 0) {
            let ft = newCap * this.loadFactor;
            newThr = (newCap < MAXIMUM_CAPACITY && ft < MAXIMUM_CAPACITY ? ft : 1 << 31);
        }

        this.threshold = newThr;
        let newTab = new Array(newCap);
        this.table = newTab;
        // 处理旧元素
        if (oldTab != null) {
            for (let j = 0; j < oldCap; ++j) {
                let e;
                if ((e = oldTab[j]) != null) {
                    oldTab[j] = null;
                    /** 啥也不是*/
                    if (e.next == null)
                        newTab[e.hash & (newCap - 1)] = e;
                    /**红黑树*/
                    else if (e instanceof Treemap){
                        /** 这里做一个简单处理，把红黑树做中序遍历拿到的数组直接set到newTab中*/
                        // (e).split(newTab, j, oldCap);
                        this.split(e,newTab)
                    }
                    /**链表*/
                    else { // preserve order
                        let loHead = null, loTail = null;
                        let hiHead = null, hiTail = null;
                        let next;
                        do{
                            /** 这里做了优化，，如果 e.hash & oldCap ==0
                             * 说明 e.hash = x000000
                             * 在newTab中，要么在0 要么在1 同理，整个链表也在这两个位置
                             * * */
                            next = e.next;
                            if ((e.hash & oldCap) === 0) {
                                if (loTail == null){
                                    loHead = e;
                                }
                                else{
                                    loTail.next = e;
                                }
                                loTail = e;
                            } else {
                                if (hiTail == null)
                                    hiHead = e;
                                else
                                    hiTail.next = e;
                                hiTail = e;
                            }
                        } while ((e = next) != null);
                        if (loTail != null) {
                            loTail.next = null;
                            newTab[j] = loHead;
                        }
                        if (hiTail != null) {
                            hiTail.next = null;
                            newTab[j + oldCap] = hiHead;
                        }
                    }
                }
            }
        }
        return newTab;
    }


    newNode(hash, key, value, next) {
        return new Node(hash, key, value, next);
    }


}


let hashMap = new HashMap();
debugger
console.log(12313111)
hashMap.put(45)
hashMap.put(48)
hashMap.put(112)
hashMap.put(240)
hashMap.put(496)
hashMap.put(1008)
hashMap.put(2032)
hashMap.put(4080)
hashMap.put(8176)
hashMap.put(16368)
