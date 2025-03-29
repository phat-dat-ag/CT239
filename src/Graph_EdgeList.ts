interface Edge {
    u: number;
    v: number;
    w: number;
    link: number;
}

// Cấu trúc đồ thị danh sách cung
export default class Graph_EdgeList {
    edges: Array<Edge>;
    n: number;
    m: number;

    // Là hàm init_graph luôn
    constructor(n: number) {
        this.n = n;
        this.edges = [];
        this.m = 0;
    }

    addEdge(u: number, v: number, w: number, link: number) {
        this.edges.push({ u, v, w, link });
        this.m++;
    }

    printGraph() {
        this.edges.forEach(e => {
            console.log(`(${e.u}, ${e.v}): ${e.w}, ${e.link}`);
        });
        console.log();
    }
}