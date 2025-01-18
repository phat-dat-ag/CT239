export const NO_EDGE = 500;
const directions = [
    { i: -1, j: 0 },
    { i: 0, j: -1 },
    { i: 0, j: 1 },
    { i: 1, j: 0 }
];
function getVertexFromPoint(point, n) {
    return point.i * n + (point.j + 1);
}
function getPointFromVertex(u, n) {
    return {
        i: Math.floor((u - 1) / n),
        j: (u - 1) % n
    };
}
export default class Graph {
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
    }
    ;
    initGraph(matrix) {
        this.weightMatrix = matrix;
        this.m = matrix.length;
        this.n = matrix[0].length;
        this.nodeCount = this.m * this.n;
        this.edgeCount = 0;
        for (let i = 1; i <= this.nodeCount; i++) {
            // Tạo 1 hàng với nodeCount phần tử
            let row = [];
            // Vị trí row[0] là empty do không dùng
            for (let i = 1; i <= this.nodeCount; i++) {
                row[i] = NO_EDGE;
            }
            // Thêm từng hàng vào, tạo nên ma trận vuông cấp nodeCount
            this.A[i] = row;
        }
    }
    // Lấy số lượng node (đỉnh và chướng ngại vật)
    getNodeCount() {
        return this.nodeCount;
    }
    getEdgeCount() {
        return this.edgeCount;
    }
    getRowCount() {
        return this.m;
    }
    getColumnCount() {
        return this.n;
    }
    // Lấy ma trận trọng số
    getWeightMatrix() {
        return this.weightMatrix;
    }
    getWeightAtCell(point) {
        return this.weightMatrix[point.i][point.j];
    }
    // Lấy các đỉnh (có thể đi đến nhau)
    getVertices() {
        const m = this.getRowCount();
        const n = this.getColumnCount();
        let vertices = [];
        for (let i = 0; i < m; i++)
            for (let j = 0; j < n; j++) {
                if (this.getWeightAtCell({ i, j }) > 0) {
                    vertices.push(getVertexFromPoint({ i, j }, n));
                }
            }
        return vertices;
    }
    // Trả về neighbors trong đồ thị
    // Một đỉnh có tối đa 4 neighbors
    getNeighborsOf(u) {
        const m = this.getRowCount();
        const n = this.getColumnCount();
        const uPoint = getPointFromVertex(u, n);
        let neighbors = [];
        for (let direction of directions) {
            const vPoint = {
                i: uPoint.i + direction.i,
                j: uPoint.j + direction.j,
            };
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
    setWeightMatrixAt(point, weight) {
        this.weightMatrix[point.i][point.j] = weight;
    }
    showGraph() {
        const m = this.getRowCount();
        const n = this.getColumnCount();
        const nodeCount = this.getNodeCount();
        const edgeCount = this.getEdgeCount();
        console.log(`Ma trận có ${m} dòng, ${n} cột và ${nodeCount} node, ${edgeCount} cung`);
        console.log("Ma trận đỉnh-đỉnh: ");
        console.log(this.A);
    }
    adjacent(u, v) {
        return this.A[u][v] !== NO_EDGE;
    }
    updateEdge(u, v, weight) {
        // Có thể là trường hợp thêm cung
        if (this.A[u][v] === NO_EDGE)
            this.edgeCount++;
        // Đơn đồ thị CÓ hướng
        this.A[u][v] = weight;
    }
    removeEdge(u, v) {
        if (this.A[u][v] != NO_EDGE) {
            this.A[u][v] = NO_EDGE;
            this.edgeCount--;
        }
    }
    showEdges() {
        const nodeCount = this.getNodeCount();
        console.log("Danh sách cung: ");
        for (let u = 1; u <= nodeCount; u++)
            for (let v = 1; v <= nodeCount; v++) {
                if (this.A[u][v] !== NO_EDGE)
                    console.log(`(${u}, ${v}): ${this.A[u][v]}`);
            }
    }
    // Cập nhật/ Thêm các cung từ u đi đến các đỉnh xung quanh
    updateEdgesFromNode(u) {
        const n = this.getColumnCount();
        const uPoint = getPointFromVertex(u, n);
        // Điểm u là CHƯỚNG NGẠI VẬT thì bỏ qua
        if (this.getWeightAtCell(uPoint) <= 0)
            return;
        // Các đỉnh lân cận với u
        let neighbors = this.getNeighborsOf(u);
        for (let v of neighbors) {
            const vPoint = getPointFromVertex(v, n);
            const weight = this.getWeightAtCell(vPoint);
            this.updateEdge(u, v, weight);
        }
    }
    // Cập nhật/ Thêm các cung từ các đỉnh xung quanh đến u
    updateEdgesToNode(u) {
        const n = this.getColumnCount();
        const uPoint = getPointFromVertex(u, n);
        // Điểm u là CHƯỚNG NGẠI VẬT thì bỏ qua
        if (this.getWeightAtCell(uPoint) <= 0)
            return;
        const weight = this.getWeightAtCell(uPoint);
        // Các đỉnh lân cận với u
        let neighbors = this.getNeighborsOf(u);
        for (let v of neighbors)
            this.updateEdge(v, u, weight);
    }
    // Biến u thành chướng ngại vật
    // Xóa các cung từ u, Xóa các cung đến u
    removeEdgesOfNode(u) {
        const n = this.getColumnCount();
        const uPoint = getPointFromVertex(u, n);
        // Không là chướng ngại vật thì bỏ qua
        if (this.getWeightAtCell(uPoint) > 0)
            return;
        let neighbors = this.getNeighborsOf(u);
        for (let v of neighbors) {
            this.removeEdge(u, v);
            this.removeEdge(v, u);
        }
    }
    buildGraph(matrix) {
        this.initGraph(matrix);
        const nodeCount = this.getNodeCount();
        for (let u = 1; u <= nodeCount; u++) {
            // Đưa đỉnh u về tọa độ
            this.updateEdgesFromNode(u);
        }
    }
}
