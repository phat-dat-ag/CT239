import { drawDirectedTree } from "./visGraph.js";
import { Check_Connected_Division } from "./algoTreeRecursion.js";
import Graph_EdgeList from "./Graph_EdgeList.js";
import Tree from "./Graph_Tree.js";
import { GraphType } from "./type/graph.types.js";
import { DirectedTree } from "./type/common.types.js";
import { OO } from "./constant/common.constant.js";

let id: Array<number> = [];

// Trả về Cây/ đồ thị xấp xỉ H[t] từ đồ thị gốc G[t]
function buildH(G: Graph_EdgeList, root: number): Tree {
    let H = new Tree(G.n);
    // Tại mỗi đỉnh: gỡ bỏ các cung, chỉ giữ lại 1 cung đến nó có trọng số nhỏ nhất
    for (let e of G.edges) {
        let { u, v, w, link } = e;
        if (w < H.weight[v]) {
            H.parent[v] = u;
            H.weight[v] = w;
            H.link[v] = link;
        }
    }
    H.parent[root] = -1;
    H.weight[root] = 0;
    return H;
}

// Trả về số chu trình trong Cây/ đồ thị xấp xỉ H
function findCycles(H: Tree, root: number): number {
    let color: Array<number> = [];

    for (let i = 1; i <= H.n; i++) {
        color[i] = -1;
        id[i] = -1;
    }
    // Số lượng chu trình
    let no = 0;

    for (let i = 1; i <= H.n; i++) {
        let u = i;
        while (u !== root && id[u] === -1 && color[u] !== i) {
            color[u] = i;
            u = H.parent[u];
        }
        if (color[u] === i) {
            no++;
            let v = H.parent[u];
            while (v !== u) {
                id[v] = no;
                v = H.parent[v];
            }
            id[u] = no;
        }
    }
    return no;
}

// Co đồ thị G[t] dựa trên Đồ thị xấp xỉ H[t] thành đồ thị G[t+1]
function contract(G: Graph_EdgeList, H: Tree, no: number): Graph_EdgeList {
    let G1 = new Graph_EdgeList(no);
    for (let e = 0; e < G.m; e++) {
        let { u, v, w } = G.edges[e];
        if (id[u] !== id[v]) {
            G1.addEdge(id[u], id[v], w - H.weight[v], e);
        }
    }
    return G1;
}

// Dãn đồ thị xấp xỉ H[t] thành đồ thị H[t-1] thông qua Đồ thị G[t-1]
// Đồ thị H[t-1] đã có trước đó rồi, chỉ cần cập nhật
// Nếu khởi tạo lại từ đầu là sai ngay
function expand(H1: Tree, G: Graph_EdgeList, H: Tree): Tree {
    for (let i = 1; i <= H1.n; i++) {
        if (H1.parent[i] !== -1) {
            let pe = G.edges[H1.link[i]];
            H.parent[pe.v] = pe.u;
            H.weight[pe.v] += H1.weight[i];
            H.link[pe.v] = pe.link;
        }
    }
    return H;
}

export function ChuLiu(graph: GraphType, s: number): void {
    let G: Array<Graph_EdgeList> = [];
    let H: Array<Tree> = [];

    let root = s;
    let t = 0;
    let graphEdgeList = graph.convertEdgeList();
    G[0] = graphEdgeList;

    while (true) {
        // console.log("=============================");
        H[t] = buildH(G[t], root);
        // console.log(`Đồ thị xấp xỉ H[${t}]: `);
        // H[t].printTree();
        let no = findCycles(H[t], root);
        if (no === 0) break;
        for (let i = 1; i <= H[t].n; i++) {
            if (id[i] === -1) id[i] = ++no;
        }
        G[t + 1] = contract(G[t], H[t], no);
        // console.log(`Đồ thị sau khi co G[${t + 1}]: `);
        // G[t + 1].printGraph();
        root = id[root];
        t++;
    }

    // Lưu ý bước này dễ sai nè, đồ thị H[k-1] đã tồn tại và đã có dữ liệu,
    // nên phải truyền vào để sử dụng và cập nhật chính bản thân nó
    // chứ không phải vô hàm expand ở trên khởi tạo lại alf sai
    for (let k = t; k > 0; k--) {
        H[k - 1] = expand(H[k], G[k - 1], H[k - 1]);
        // console.log(`Đồ thị sau khi dãn H[${k - 1}]: `);
        // H[k - 1].printTree();
    }
    // console.log("Kết quả: ")
    // console.log(H[0]);

    let isValidVertex: Array<boolean> = Check_Connected_Division(graph, s);
    // console.log(isValidVertex);

    let directedTree: Array<DirectedTree> = [];
    // Loại bỏ các đỉnh là chướng ngại vật
    // Loại bỏ luôn các đỉnh mà s không thể đi tới (khác bộ phận liên thông)
    for (let u = 1; u <= H[0].n; u++)
        if ((H[0].parent[u] !== -1 || H[0].weight[u] !== OO) && isValidVertex[u])
            directedTree.push({ u, p: H[0].parent[u], w: H[0].weight[u] });

    drawDirectedTree(directedTree);
}