var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setMinPath, resetMinPath, setVisitingPath, resetVisitingPath } from "./draw.js";
// Do phạm vi -99 đến 99 nên gắn 500 để là giá trị đặc biệt
const NO_EDGE = 500;
const OO = 999999999;
const directions = [
    { i: -1, j: 0 },
    { i: 0, j: -1 },
    { i: 0, j: 1 },
    { i: 1, j: 0 }
];
var minPath = [];
function getVertexFromPoint(point, n) {
    return point.i * n + (point.j + 1);
}
function getPointFromVertex(u, n) {
    return {
        i: Math.floor((u - 1) / n),
        j: (u - 1) % n
    };
}
function getPathTo(u, parents) {
    const path = [];
    do {
        path.push(u);
        u = parents[u];
    } while (u !== -1);
    return path.reverse();
}
function initVisitingPath(s, n, ms) {
    return __awaiter(this, void 0, void 0, function* () {
        yield setVisitingPath([s], n, ms);
        return [s];
    });
}
function updateVisitingPath(u, parents, visitingPath, n, ms) {
    return __awaiter(this, void 0, void 0, function* () {
        if (parents[u] === -1)
            return;
        if (parents[u] === visitingPath[visitingPath.length - 1]) {
            // u là đỉnh tiếp theo trong visitingPath
            visitingPath.push(u);
            yield setVisitingPath([u], n, ms);
        }
        else {
            // u KHÔNG là đỉnh tiếp theo trong visitingPath
            let newPath = getPathTo(u, parents);
            // Tìm giao điểm của 2 đường đi
            let intersectIndex = 0;
            let min_length = Math.min(visitingPath.length, newPath.length);
            while (visitingPath[intersectIndex] === newPath[intersectIndex] && intersectIndex < min_length)
                intersectIndex++;
            // Cắt mảng để reset
            const resetPath = visitingPath.slice(intersectIndex).reverse();
            // reset lại màu
            yield resetVisitingPath(resetPath, n, ms);
            // Cắt lấy phần sẽ nối vào
            let right = newPath.slice(intersectIndex);
            // tô màu cho mảng mới
            yield setVisitingPath(right, n, ms);
            // Nối vào, cập nhật lại visitingPath
            visitingPath.splice(intersectIndex, visitingPath.length - intersectIndex, ...right);
        }
    });
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
    Dijkstra(s, t, ms) {
        return __awaiter(this, void 0, void 0, function* () {
            const m = this.getRowCount();
            const n = this.getColumnCount();
            // Làm mới minPath trước đó
            resetMinPath(minPath.reverse(), n);
            minPath = [];
            // Tập hợp chỉ chứa toàn đỉnh, không có chướng ngại vật
            const vertices = this.getVertices();
            const vertexCount = vertices.length;
            console.log("Đường đi từ ", s, " đến ", t);
            if (s <= 0 || s > m * n || !vertices.includes(s)) {
                confirm(`Đỉnh bắt đầu là ${s}: không hợp lệ`);
                return;
            }
            if (t <= 0 || t > m * n || !vertices.includes(t)) {
                confirm(`Đỉnh kết thúc là ${t}: không hợp lệ`);
                return;
            }
            // Khởi tạo 1 mảng chứa các đỉnh đang duyệt
            let visitingPath = yield initVisitingPath(s, n, ms);
            // Khởi tạo
            const nodeCount = this.getNodeCount();
            let distances = [], parents = [], visited = [];
            for (let u = 1; u <= nodeCount; u++) {
                distances[u] = OO;
                parents[u] = 0;
                visited[u] = false;
            }
            // Đánh dấu đỉnh s
            distances[s] = 0;
            visited[s] = false;
            parents[s] = -1;
            // Tìm đỉnh có đường đi nhỏ nhất, lặp lại tối đa vertexCount - 1 lần
            // Khác với lý thuyết đồ thị bình thường
            // Có trường hợp các đỉnh bị cô lập, không đi được đến tất cả các đỉnh còn lại được
            for (let i = 0; i < vertexCount - 1; i++) {
                let u = -1;
                let min_distance = OO;
                // Tìm đỉnh đang có distance nhỏ nhất
                for (let vertex of vertices) {
                    if (distances[vertex] < min_distance && !visited[vertex]) {
                        min_distance = distances[vertex];
                        u = vertex;
                    }
                }
                // Có những trường hợp bị treo nên không thể tới được
                // Đồ thị không liên thông
                if (u === -1)
                    continue;
                visited[u] = true;
                yield updateVisitingPath(u, parents, visitingPath, n, ms);
                // Cập nhật đường đi đến các đỉnh lân cận
                for (let v of vertices) {
                    if (this.adjacent(u, v) && distances[u] + this.A[u][v] < distances[v]) {
                        distances[v] = distances[u] + this.A[u][v];
                        parents[v] = u;
                    }
                }
            }
            // Reset lại đường đi cuối cùng
            visitingPath.reverse();
            yield resetVisitingPath(visitingPath, n, ms);
            // Hiển thị đường đi ngắn nhất
            if (distances[t] !== OO) {
                minPath = getPathTo(t, parents);
                yield setMinPath(minPath, n, ms);
                console.log("Độ dài: ", distances[t]);
            }
            else {
                confirm(`Không có đường đi từ ${s} đến ${t}`);
            }
        });
    }
}
