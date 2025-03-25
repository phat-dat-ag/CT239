interface GraphType {
    getNeighborsOf(u: number): Array<number>;
    getNodeCount(): number;
    adjacent(u: number, v: number): boolean;
}

interface Pair {
    u: number;
    p: number;
}

let G: GraphType;
let mark: Array<boolean> = [];
let parent: Array<number> = [];
let nodeCount: number;

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

// Trả về tất cả các đỉnh, có dạng: empty, true, true, flase, ...
// True: đỉnh đó thuộc bộ phân liên thông của s
// False: đỉnh đó không thuộc bộ phận liên thông của s
// empty: tại vị trí số 0 => không tính
// Hỗ trợ cho thật toán ChuLiu Edmons
export default function Tree_Recursion(inputG: GraphType, s: number): Array<boolean> {
    G = inputG;
    nodeCount = G.getNodeCount();
    for (let u = 1; u <= nodeCount; u++) {
        parent[u] = 0;
        mark[u] = false;
    }

    Recursion({ u: s, p: -1 });
    return mark;
}