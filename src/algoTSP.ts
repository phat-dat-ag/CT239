import Tree_Recursion from "./Recursion.js";
import { drawDirectedTree } from "./visGraph.js";

const OO: number = 999999;

interface GraphType {
    getNeighborsOf(u: number): Array<number>;
    getNodeCount(): number;
    getWeightOfEdge(u: number, v: number): number;
    adjacent(u: number, v: number): boolean;
}

interface EdgeList {
    u: number;
    v: number;
    w: number;
}

interface DirectedTree {
    u: number;
    p: number;
    w: number | string;
}

// Lưu đồ thị đỉnh đỉnh
let G: GraphType;
// Mảng 2 chiều: Bảng để tra cung đó có duyệt hay chưa
let edgeTable: Array<Array<boolean>> = [];
// Chứa danh sách cung
let edgeList: Array<EdgeList> = [];
// Lưu số đỉnh (thuộc bộ phận liên thông của s)
let vertexCount: number = 0;
// Lưu danh sách cung đang duyệt qua
let travellingEdges: Array<EdgeList>;
// Lưu danh sách cung là phương án
// => khi thuật toán kết thúc thì nó là đáp án luôn
let selectedEdges: Array<EdgeList>;
// Lưu tổng giá trị
let weightTotal: number;
// Lưu cận dưới
let CD: number;
// Lưu giá trị nhỏ nhất tạm thời của đường đi
let temporaryWeightTotal: number;

// Lấy danh sách cung và số lượng đỉnh thuộc bộ phận liên thông chứa s
function convertEdgeList(G: GraphType, sVertex: number) {
    const nodeCount: number = G.getNodeCount();

    // Khởi tạo bảng tra cung
    for (let u = 1; u <= nodeCount; u++) {
        let row: Array<boolean> = [];
        for (let v = 1; v <= nodeCount; v++)
            row[v] = false;
        edgeTable[u] = row;
    }

    // Tìm bộ phận liên thông chứa s: true thì thuộc, false thì không
    let connection: Array<boolean> = Tree_Recursion(G, sVertex);

    // Đếm số đỉnh thuộc bộ phận liên thông
    vertexCount = 0;
    let neighbors: Array<number> = [];
    // Lấy danh sách các cung thuộc bộ phận liên thông chứa s
    for (let u = 1; u <= nodeCount; u++)
        if (connection[u]) {
            vertexCount++;
            neighbors = G.getNeighborsOf(u);
            for (let v of neighbors)
                edgeList.push({ u, v, w: G.getWeightOfEdge(u, v) });
        }
}

// Kiểm tra có tạo chu trình không
// Thuật toán này không cho phép tạo chu trình
// Sẽ tự khép chu trình "bằng tay"
function isCycle(nextVertex: number, index: number): boolean {
    for (let e = 0; e < index; e++)
        if (travellingEdges[e].u === nextVertex)
            return true;
    return false;
}

// Tìm trọng số cung chưa dùng và nhỏ nhất
function getMinimumWeightOfEdge() {
    let min = OO;
    for (let e = 0; e < edgeList.length; e++) {
        let u: number = edgeList[e].u;
        let v: number = edgeList[e].v;
        let w: number = edgeList[e].w;
        if (!edgeTable[u][v] && min > w)
            min = w;
    }
    return min;
}

// Kiểm tra xem có khép lại thành chu trình được hay không
// Nó khác với bài TSP gốc ở chỗ
// đỉnh cuối cùng có thể không đi về ban đầu được
// cung start -> end
// đỉnh start (cuối cùng của chu trình) nối trở về đỉnh end (đỉnh ban đầu)
function checkValid(start: number, end: number): boolean {
    let neighbors: Array<number> = G.getNeighborsOf(start);
    for (let u of neighbors)
        if (u === end)
            return true;
    return false;
}

// Cập nhật phương án
function updateTree(v: number, vertexCount: number) {
    let u: number = travellingEdges[0].u;
    // Nếu không có kết quả nào được cập nhật chứng tỏ không thể tìm ra chu trình
    if (checkValid(v, u)) {
        let w: number = G.getWeightOfEdge(v, u);
        // Khép chu trình lại
        travellingEdges[vertexCount - 1] = { u: v, v: u, w }
        weightTotal += w;
        if (weightTotal < temporaryWeightTotal) {
            selectedEdges = [];
            for (let e = 0; e < vertexCount; e++)
                selectedEdges[e] = travellingEdges[e];
            temporaryWeightTotal = weightTotal;
        }
    }
}

function TSP(u: number, index: number) {
    // Duyệt qua các đỉnh lân cận của u
    let neighbors: Array<number> = G.getNeighborsOf(u);
    for (let v of neighbors) {
        if (!isCycle(v, index) && !edgeTable[u][v]) {
            let w = G.getWeightOfEdge(u, v);
            weightTotal += w;
            // CD = weightTotal + (Số cạnh còn lại)*cạnh nhỏ nhất
            // Số cạnh = Số cung
            CD = weightTotal + (vertexCount - index - 1) * getMinimumWeightOfEdge();
            if (CD < temporaryWeightTotal) {
                travellingEdges[index] = { u, v, w };
                edgeTable[u][v] = true;
                if (index === vertexCount - 2)
                    updateTree(v, vertexCount);
                else
                    TSP(v, index + 1);
            }
            weightTotal -= w;
            edgeTable[u][v] = false;
        }
    }
}

export default function Tree_TSP(container: HTMLDivElement, graph: GraphType, sVertex: number) {
    G = graph;
    convertEdgeList(graph, sVertex);
    // Khởi tạo trước khi chạy
    weightTotal = 0;
    temporaryWeightTotal = OO;
    CD = 0;
    travellingEdges = [];
    // Thuật toán chạy xong mà mảng vẫn rỗng thì không thể tìm ra
    selectedEdges = [];
    let index = 0;

    TSP(sVertex, index);

    // Tạo cây
    let tree: Array<DirectedTree> = [];
    for (let e of selectedEdges)
        tree.push({ u: e.v, p: e.u, w: e.w });

    drawDirectedTree(container, tree);
}