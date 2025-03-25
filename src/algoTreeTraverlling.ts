import { Queue, Stack } from "./Lib_Queue_Stack.js";
import { drawDirectedTree } from "./visGraph.js";

interface GraphType {
    getNeighborsOf(u: number): Array<number>;
    getNodeCount(): number;
}

interface directedTree {
    u: number;
    p: number;
    w: number | string;
}

// Đều là biến toàn cục để 2 hàm thay nhau sử dụng
let nodeCount: number;
let parent: Array<number> = [], mark: Array<boolean> = [];
let tree: Array<directedTree> = [];

function init(G: GraphType) {
    tree = [];
    nodeCount = G.getNodeCount();
    for (let u = 0; u <= nodeCount; u++) {
        parent[u] = 0;
        mark[u] = false;
    }
}

function createTree() {
    for (let u = 1; u <= nodeCount; u++)
        if (parent[u] !== 0)
            tree.push({ u, p: parent[u], w: "" });
}

function BFS(G: GraphType, s: number, mark: Array<boolean>, parent: Array<number>) {
    var arr = [];

    // Khởi tạo hàng đợi
    let Q = new Queue();
    Q.make_null_queue();

    // Đưa s vào hàng đợi
    Q.en_queue({ u: s, p: -1 });

    // Duyệt đến khi hàng đợi rỗng
    while (!Q.empty_queue()) {
        // Lấy đỉnh u và p_u ra khỏi hàng đợi và xóa
        const pair = Q.front();
        Q.de_queue();
        const u = pair.u;
        const p_u = pair.p;
        if (!mark[u]) {
            // Đánh dấu u đã duyệt và cha của u
            mark[u] = true;
            parent[u] = p_u;
            arr.push(u);
            // Kiểm tra các đỉnh v lân cận u
            const neighbors = G.getNeighborsOf(u);
            for (let v of neighbors)
                if (!mark[v])
                    Q.en_queue({ u: v, p: u });
        }
    }
    return arr;
}

function DFS(G: GraphType, s: number, mark: Array<boolean>, parent: Array<number>) {
    var arr = [];

    // Khởi tạo ngăn xếp
    let S = new Stack();
    S.make_null_stack();

    // Đưa s vào ngăn xếp
    S.push({ u: s, p: -1 });

    // Duyệt đến khi ngăn xếp rỗng
    while (!S.empty_stack()) {
        // Lấy đỉnh u và p_u ra khỏi ngăn xếp và xóa
        const pair = S.top();
        S.pop();
        const u = pair.u;
        const p_u = pair.p;
        if (!mark[u]) {
            // Đánh dấu u đã duyệt và cha của u
            mark[u] = true;
            parent[u] = p_u;
            arr.push(u);
            // Kiểm tra các đỉnh v lân cận u
            const neighbors = G.getNeighborsOf(u);
            for (let v of neighbors)
                if (!mark[v])
                    S.push({ u: v, p: u });
        }
    }
    return arr;
}

export function Tree_BFS(container: HTMLDivElement, G: GraphType, s: number) {
    init(G);
    BFS(G, s, mark, parent);
    createTree();
    drawDirectedTree(container, tree);
}

export function Tree_DFS(container: HTMLDivElement, G: GraphType, s: number) {
    init(G);
    DFS(G, s, mark, parent);
    createTree();
    drawDirectedTree(container, tree);
}