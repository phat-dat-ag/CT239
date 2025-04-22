import Queue from "./Lib_Queus.js";
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

function BFS(G: GraphType, s: number, mark: Array<boolean>, parent: Array<number>) {
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
            // Kiểm tra các đỉnh v lân cận u
            const neighbors = G.getNeighborsOf(u);
            for (let v of neighbors)
                if (!mark[v])
                    Q.en_queue({ u: v, p: u });
        }
    }
}

export function Tree_BFS(G: GraphType, s: number) {
    init(G);
    BFS(G, s, mark, parent);
    createTree();
    drawDirectedTree(tree);
}

export function All_Tree_BFS(G: GraphType) {
    init(G);
    for (let u = 1; u <= nodeCount; u++)
        if (!mark[u])
            BFS(G, u, mark, parent);
    createTree();
    drawDirectedTree(tree);
}