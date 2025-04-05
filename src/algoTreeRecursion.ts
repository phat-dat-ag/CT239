import { drawDirectedTree } from "./visGraph.js";

interface GraphType {
    getNeighborsOf(u: number): Array<number>;
    getNodeCount(): number;
    adjacent(u: number, v: number): boolean;
    getVertices(): Array<number>;
}

interface Pair {
    u: number;
    p: number;
}

interface DirectedTree {
    u: number;
    p: number;
    w: number | string;
}

let G: GraphType;
let mark: Array<boolean> = [];
let parent: Array<number> = [];
// Đánh dấu các đỉnh đi đến được (loại chứng ngại vật ra)
let isVertex: Array<boolean> = [];
let tree: Array<DirectedTree> = [];
let nodeCount: number;

function createTree() {
    for (let u = 1; u <= nodeCount; u++)
        if (parent[u] && isVertex[u])
            tree.push({ u, p: parent[u], w: "" });
}

function Recursion(pair: Pair) {
    if (!mark[pair.u]) {
        let u = pair.u;
        mark[u] = true;
        parent[u] = pair.p
        for (let v = 1; v <= nodeCount; v++)
            if (G.adjacent(u, v))
                Recursion({ u: v, p: u });
    }
}

function init(inputG: GraphType) {
    tree = [];
    G = inputG;
    nodeCount = G.getNodeCount();
    for (let u = 1; u <= nodeCount; u++) {
        parent[u] = 0;
        mark[u] = false;
        isVertex[u] = false;
    }

    let vertices: Array<number> = G.getVertices();
    for (let u of vertices)
        isVertex[u] = true;
}

// Trả về tất cả các đỉnh, có dạng: empty, true, true, flase, ...
// True: đỉnh đó thuộc bộ phân liên thông của s
// False: đỉnh đó không thuộc bộ phận liên thông của s
// empty: tại vị trí số 0 => không tính
// Hỗ trợ cho thật toán ChuLiu Edmons
export function Check_Connected_Division(inputG: GraphType, s: number): Array<boolean> {
    init(inputG);
    Recursion({ u: s, p: -1 });
    return mark;
}

// Chỉ duyệt bộ phận chứa đỉnh s bắt đầu
export function Tree_Recursion(container: HTMLDivElement, inputG: GraphType, s: number) {
    init(inputG);
    Recursion({ u: s, p: -1 });
    createTree();
    drawDirectedTree(container, tree);
}

// Duyệt hết bắt đầu từ 1
export function All_Tree_Recursion(container: HTMLDivElement, inputG: GraphType) {
    init(inputG);
    for (let u = 1; u <= nodeCount; u++)
        if (!mark[u])
            Recursion({ u, p: -1 });
    createTree();
    drawDirectedTree(container, tree);
}