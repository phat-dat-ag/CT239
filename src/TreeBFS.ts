import Queue from "./LibQueue.js";
import { drawDirectedTree } from "./visGraph.js";

interface GraphType {
    getNeighborsOf(u: number): Array<number>;
    getNodeCount(): number;
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
export default function Tree_BFS(container: HTMLDivElement, G: GraphType, s: number) {
    const nodeCount = G.getNodeCount();
    let parent = [], mark = [];
    for (let u = 0; u <= nodeCount; u++) {
        parent[u] = 0;
        mark[u] = false;
    }

    BFS(G, s, mark, parent);
    drawDirectedTree(container, parent);
}