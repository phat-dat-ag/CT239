import Graph_EdgeList from "./Graph_EdgeList.js";
interface Point {
    i: number;
    j: number;
}

// Do phạm vi -99 đến 99 nên gắn 500 để là giá trị đặc biệt
const NO_EDGE: number = 500;
const directions: Array<Point> = [
    { i: -1, j: 0 },
    { i: 0, j: -1 },
    { i: 0, j: 1 },
    { i: 1, j: 0 }
];

function getVertexFromPoint(point: Point, n: number): number {
    return point.i * n + (point.j + 1);
}

function getPointFromVertex(u: number, n: number): Point {
    return {
        i: Math.floor((u - 1) / n),
        j: (u - 1) % n
    }
}

export default class Graph {
    private weightMatrix: Array<Array<number>>;
    private m: number;
    private n: number;
    private A: Array<Array<number>>;
    private nodeCount: number;
    private edgeCount: number;
    constructor() {
        // Ma trận trọng số: m dòng, n cột
        this.weightMatrix = [];
        this.m = 0;
        this.n = 0;
        // Ma trận lưu trữ đồ thị
        this.A = [];
        // node này bao gồm cả vertex và obstacle
        this.nodeCount = 0;
        this.edgeCount = 0;
    };
    initGraph(matrix: Array<Array<number>>): void {
        this.weightMatrix = matrix;
        this.m = matrix.length;
        this.n = matrix[0].length;
        this.nodeCount = this.m * this.n;
        this.edgeCount = 0;

        for (let i = 1; i <= this.nodeCount; i++) {
            // Tạo 1 hàng với nodeCount phần tử
            let row: Array<number> = [];
            // Vị trí row[0] là empty do không dùng
            for (let i = 1; i <= this.nodeCount; i++) {
                row[i] = NO_EDGE;
            }
            // Thêm từng hàng vào, tạo nên ma trận vuông cấp nodeCount
            this.A[i] = row;
        }
    }
    // Lấy số lượng node (đỉnh và chướng ngại vật)
    getNodeCount(): number {
        return this.nodeCount;
    }
    getEdgeCount(): number {
        return this.edgeCount;
    }
    getRowCount(): number {
        return this.m;
    }
    getColumnCount(): number {
        return this.n;
    }
    // Lấy ma trận trọng số
    getWeightMatrix(): Array<Array<number>> {
        return this.weightMatrix;
    }
    getWeightAtCell(point: Point): number {
        return this.weightMatrix[point.i][point.j];
    }
    // Lấy ma trận đỉnh đỉnh
    getVertexMatrix() {
        return this.A;
    }
    // Lấy trọng số của cung
    getWeightOfEdge(u: number, v: number) {
        return this.A[u][v];
    }
    // Lấy các đỉnh (có thể đi đến nhau)
    getVertices(): Array<number> {
        const m: number = this.getRowCount();
        const n: number = this.getColumnCount();
        let vertices: Array<number> = [];
        for (let i = 0; i < m; i++)
            for (let j = 0; j < n; j++) {
                if (this.getWeightAtCell({ i, j }) > 0) {
                    vertices.push(getVertexFromPoint({ i, j }, n));
                }
            }
        return vertices;
    }
    // Tạo đồ thị danh sách các cung từ ma trận đỉnh đỉnh
    convertEdgeList(): Graph_EdgeList {
        let graphEdgeList = new Graph_EdgeList(this.nodeCount);
        for (let u = 1; u <= this.nodeCount; u++)
            for (let v = 1; v <= this.nodeCount; v++)
                if (this.A[u][v] !== NO_EDGE)
                    graphEdgeList.addEdge(u, v, this.A[u][v], -1);
        return graphEdgeList;
    }
    // Trả về neighbors trong đồ thị
    // Một đỉnh có tối đa 4 neighbors
    getNeighborsOf(u: number): Array<number> {
        const m: number = this.getRowCount();
        const n: number = this.getColumnCount();

        const uPoint: Point = getPointFromVertex(u, n);
        let neighbors: Array<number> = [];
        for (let direction of directions) {
            const vPoint: Point = {
                i: uPoint.i + direction.i,
                j: uPoint.j + direction.j,
            }
            // Nếu tọa độ mới nằm ngoài ma trận thì BỎ QUA
            if (vPoint.i < 0 || vPoint.i >= m || vPoint.j < 0 || vPoint.j >= n)
                continue;
            // Điểm đó là CHƯỚNG NGẠI VẬT thì bỏ qua
            if (this.getWeightAtCell(vPoint) <= 0)
                continue;
            // Thêm vào tập hợp các đỉnh lân cận của đỉnh u
            neighbors.push(getVertexFromPoint(vPoint, n));
        }
        return neighbors;
    }
    setWeightMatrixAt(point: Point, weight: number): void {
        this.weightMatrix[point.i][point.j] = weight;
    }
    showGraph(): void {
        const m: number = this.getRowCount();
        const n: number = this.getColumnCount();
        const nodeCount = this.getNodeCount();
        const edgeCount = this.getEdgeCount();
        console.log(`Ma trận có ${m} dòng, ${n} cột và ${nodeCount} node, ${edgeCount} cung`);
        console.log("Ma trận đỉnh-đỉnh: ")
        console.log(this.A);
    }
    adjacent(u: number, v: number): boolean {
        return this.A[u][v] !== NO_EDGE;
    }
    updateEdge(u: number, v: number, weight: number): void {
        // Có thể là trường hợp thêm cung
        if (this.A[u][v] === NO_EDGE)
            this.edgeCount++;
        // Đơn đồ thị CÓ hướng
        this.A[u][v] = weight;
    }
    removeEdge(u: number, v: number): void {
        if (this.A[u][v] != NO_EDGE) {
            this.A[u][v] = NO_EDGE;
            this.edgeCount--;
        }
    }
    showEdges(): void {
        const nodeCount = this.getNodeCount();
        console.log("Danh sách cung: ")
        for (let u = 1; u <= nodeCount; u++)
            for (let v = 1; v <= nodeCount; v++) {
                if (this.A[u][v] !== NO_EDGE)
                    console.log(`(${u}, ${v}): ${this.A[u][v]}`);
            }
    }

    // Cập nhật/ Thêm các cung từ u đi đến các đỉnh xung quanh
    updateEdgesFromNode(u: number): void {
        const n: number = this.getColumnCount();
        const uPoint: Point = getPointFromVertex(u, n);

        // Điểm u là CHƯỚNG NGẠI VẬT thì bỏ qua
        if (this.getWeightAtCell(uPoint) <= 0)
            return;

        // Các đỉnh lân cận với u
        let neighbors: Array<number> = this.getNeighborsOf(u);
        for (let v of neighbors) {
            const vPoint: Point = getPointFromVertex(v, n);
            const weight: number = this.getWeightAtCell(vPoint);
            this.updateEdge(u, v, weight);
        }
    }

    // Cập nhật/ Thêm các cung từ các đỉnh xung quanh đến u
    updateEdgesToNode(u: number): void {
        const n: number = this.getColumnCount();
        const uPoint: Point = getPointFromVertex(u, n);

        // Điểm u là CHƯỚNG NGẠI VẬT thì bỏ qua
        if (this.getWeightAtCell(uPoint) <= 0)
            return;

        const weight: number = this.getWeightAtCell(uPoint);

        // Các đỉnh lân cận với u
        let neighbors: Array<number> = this.getNeighborsOf(u);

        for (let v of neighbors)
            this.updateEdge(v, u, weight);
    }
    // Biến u thành chướng ngại vật
    // Xóa các cung từ u, Xóa các cung đến u
    removeEdgesOfNode(u: number): void {
        const n: number = this.getColumnCount();
        const uPoint: Point = getPointFromVertex(u, n);
        // Không là chướng ngại vật thì bỏ qua
        if (this.getWeightAtCell(uPoint) > 0)
            return;

        let neighbors: Array<number> = this.getNeighborsOf(u);

        for (let v of neighbors) {
            this.removeEdge(u, v);
            this.removeEdge(v, u);
        }
    }

    buildGraph(matrix: Array<Array<number>>): void {
        this.initGraph(matrix);
        const nodeCount: number = this.getNodeCount();

        for (let u = 1; u <= nodeCount; u++) {
            // Đưa đỉnh u về tọa độ
            this.updateEdgesFromNode(u);
        }
    }
}