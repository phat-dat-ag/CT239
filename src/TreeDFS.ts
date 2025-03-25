import Stack from "./LibStack.js";
import { drawDirectedTree } from "./visGraph.js";

interface GraphType {
    getNeighborsOf(u: number): Array<number>;
    getNodeCount(): number;
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

interface directedTree {
    u: number;
    p: number;
    w: number | string;
}

export default function Tree_DFS(container: HTMLDivElement, G: GraphType, s: number) {
    const nodeCount = G.getNodeCount();
    let parent = [], mark = [];
    for (let u = 0; u <= nodeCount; u++) {
        parent[u] = 0;
        mark[u] = false;
    }

    DFS(G, s, mark, parent);

    let tree: Array<directedTree> = [];
    for (let u = 1; u <= nodeCount; u++)
        if (parent[u] !== 0)
            tree.push({ u, p: parent[u], w: "" });

    drawDirectedTree(container, tree);
}