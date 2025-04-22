import Stack from "./Lib_Stack.js";
import { drawDirectedTree } from "./visGraph.js";
import { GraphType } from "./type/graph.types.js";
import { DirectedTree } from "./type/common.types.js";

let nodeCount: number;
let parent: Array<number> = [], mark: Array<boolean> = [];
// Đánh dấu các đỉnh đi đến được (loại chứng ngại vật ra)
let isVertex: Array<boolean> = [];
let tree: Array<DirectedTree> = [];

function init(G: GraphType) {
    tree = [];
    nodeCount = G.getNodeCount();
    for (let u = 0; u <= nodeCount; u++) {
        parent[u] = 0;
        mark[u] = false;
        isVertex[u] = false;
    }

    let vertices: Array<number> = G.getVertices();
    for (let u of vertices)
        isVertex[u] = true;
}

function createTree() {
    for (let u = 1; u <= nodeCount; u++)
        if (parent[u] && isVertex[u])
            tree.push({ u, p: parent[u], w: "" });
}

function DFS(G: GraphType, s: number, mark: Array<boolean>, parent: Array<number>) {
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
            // Kiểm tra các đỉnh v lân cận u
            const neighbors = G.getNeighborsOf(u);
            for (let v of neighbors)
                if (!mark[v])
                    S.push({ u: v, p: u });
        }
    }
}

export function Tree_DFS(G: GraphType, s: number) {
    init(G);
    DFS(G, s, mark, parent);
    createTree();
    drawDirectedTree(tree);
}

export function All_Tree_DFS(G: GraphType) {
    init(G);
    for (let u = 1; u <= nodeCount; u++)
        if (!mark[u])
            DFS(G, u, mark, parent);
    createTree();
    drawDirectedTree(tree);
}