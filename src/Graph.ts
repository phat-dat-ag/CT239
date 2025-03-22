import { setMinPath, resetMinPath, setVisitingPath, resetVisitingPath, showUpdateVertex, hideUpdateVertex, colorizeNeighbors, deleteColorOfNeighbors } from "./draw.js";

interface Point {
    i: number;
    j: number;
}

// Do phạm vi -99 đến 99 nên gắn 500 để là giá trị đặc biệt
const NO_EDGE: number = 500;
const OO: number = 999999999;
const directions: Array<Point> = [
    { i: -1, j: 0 },
    { i: 0, j: -1 },
    { i: 0, j: 1 },
    { i: 1, j: 0 }
];

var minPath: Array<number> = [];

function getVertexFromPoint(point: Point, n: number): number {
    return point.i * n + (point.j + 1);
}

function getPointFromVertex(u: number, n: number): Point {
    return {
        i: Math.floor((u - 1) / n),
        j: (u - 1) % n
    }
}

function getPathTo(u: number, parents: Array<number>): Array<number> {
    const path: Array<number> = [];
    do {
        path.push(u);
        u = parents[u];
    } while (u !== -1);
    return path.reverse();
}

async function updateVisitingPath(u: number, parents: Array<number>, visitingPath: Array<number>, n: number, ms: number): Promise<void> {
    if (parents[u] === visitingPath[visitingPath.length - 1]) {
        // u là đỉnh tiếp theo trong visitingPath
        visitingPath.push(u);
        await setVisitingPath([u], n, ms);
    } else {
        // u KHÔNG là đỉnh tiếp theo trong visitingPath
        let newPath: Array<number> = getPathTo(u, parents);

        // Tìm giao điểm của 2 đường đi
        let intersectIndex: number = 0;
        // Vẫn đúng với TH đỉnh s đầu tiên,
        // Mảng visitingPath rỗng và mảng newPath có phần tử s duy nhất
        let min_length: number = Math.min(visitingPath.length, newPath.length);
        while (visitingPath[intersectIndex] === newPath[intersectIndex] && intersectIndex < min_length)
            intersectIndex++;

        // Cắt mảng để reset
        const resetPath: Array<number> = visitingPath.slice(intersectIndex).reverse();
        // reset lại màu
        await resetVisitingPath(resetPath, n, ms);

        // Cắt lấy phần sẽ nối vào
        let right: Array<number> = newPath.slice(intersectIndex);
        // tô màu cho mảng mới
        await setVisitingPath(right, n, ms);

        // Nối vào, cập nhật lại visitingPath
        visitingPath.splice(intersectIndex, visitingPath.length - intersectIndex, ...right);
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

    async Dijkstra(s: number, t: number, ms: number): Promise<void> {
        const m: number = this.getRowCount();
        const n: number = this.getColumnCount();
        const block_1: HTMLDivElement = document.getElementById("block-1") as HTMLDivElement;
        const block_2: HTMLDivElement = document.getElementById("block-2") as HTMLDivElement;
        const block_3: HTMLDivElement = document.getElementById("block-3") as HTMLDivElement;
        // Làm mới minPath trước đó
        resetMinPath(minPath.reverse(), n)
        minPath = [];

        // Tập hợp chỉ chứa toàn đỉnh, không có chướng ngại vật
        const vertices: Array<number> = this.getVertices();
        const vertexCount: number = vertices.length;

        if (s <= 0 || s > m * n || !vertices.includes(s)) {
            confirm(`Đỉnh bắt đầu là ${s}: không hợp lệ`);
            return;
        }
        if (t <= 0 || t > m * n || !vertices.includes(t)) {
            confirm(`Đỉnh kết thúc là ${t}: không hợp lệ`);
            return;
        }
        // Khởi tạo 1 mảng chứa các đỉnh đang duyệt
        let visitingPath: Array<number> = [];

        // Khởi tạo
        const nodeCount: number = this.getNodeCount();
        let distances: Array<number> = [], parents: Array<number> = [], visited: Array<boolean> = [];
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
            // khi đã thấy đường đi ngắn nhất thì ngưng
            if (visited[t]) {
                i = vertexCount;
                continue;
            }
            let u: number = -1;
            let min_distance: number = OO;
            // Tìm đỉnh đang có distance nhỏ nhất
            for (let vertex of vertices) {
                if (distances[vertex] < min_distance && !visited[vertex]) {
                    min_distance = distances[vertex];
                    u = vertex;
                }
            }
            // Có những trường hợp bị treo nên không thể tới được
            // Đồ thị không liên thông
            if (u === -1) continue;

            visited[u] = true;

            const selectedVertex: HTMLHeadingElement = document.createElement("h4") as HTMLHeadingElement;
            selectedVertex.innerText = "Đỉnh đang có đường đi ngắn nhất:";
            const p: HTMLParagraphElement = document.createElement("span") as HTMLParagraphElement;
            p.innerHTML = `<span style="color:red">Chọn đỉnh: ${u}</span> <br> <span style="color:blue">Đường đi ngắn nhất: ${distances[u]}</span>`;
            block_1.appendChild(selectedVertex);
            block_1.appendChild(p);

            await updateVisitingPath(u, parents, visitingPath, n, ms);
            // Lấy danh sách các đỉnh lân cận
            let neighbors: Array<number> = this.getNeighborsOf(u);

            const neighborsString: Array<string> = [];
            for (let u of neighbors)
                neighborsString.push(`Đỉnh ${u}`);

            const neighborsInfor: HTMLHeadingElement = document.createElement("h4") as HTMLHeadingElement;
            neighborsInfor.innerHTML = `Các đỉnh lân cận của đỉnh ${u}: <br> <span style="color:red">${neighborsString.join(", ")}</span>`;
            block_2.appendChild(neighborsInfor);

            await colorizeNeighbors(neighbors, n, ms);

            // Cập nhật đường đi đến các đỉnh lân cận
            for (let v of neighbors) {
                let decisionString: string = `Đỉnh ${v}: `;
                if (visited[v])
                    decisionString = decisionString.concat(`<span style="color:red">đã duyệt rồi! BỎ QUA</span>`);
                else
                    if (this.adjacent(u, v) && distances[u] + this.A[u][v] < distances[v]) {
                        distances[v] = distances[u] + this.A[u][v];
                        parents[v] = u;
                        decisionString = decisionString.concat(`Chưa là đường đi nhỏ nhất <br> Cập nhật: <br> <span style="color:red">Tổng trọng số đường đi: ${distances[v]}</span>  <br> <span style="color:red">Đỉnh trước đó: ${u}</span>`);
                    } else
                        decisionString = decisionString.concat(`Đang là đường đi ngắn nhất <br> <span style="color:blue">Không cần cập nhật</span>`);

                const updateVertex: HTMLParagraphElement = document.createElement("h4") as HTMLParagraphElement;
                updateVertex.innerHTML = decisionString;
                block_3.appendChild(updateVertex);
                await showUpdateVertex(v, n, ms);
                hideUpdateVertex(v, n, ms);
                block_3.replaceChildren();
            }
            block_2.replaceChildren();
            deleteColorOfNeighbors(neighbors, n, ms);
            block_1.replaceChildren();
        }

        // Reset lại đường đi cuối cùng
        visitingPath.reverse();
        await resetVisitingPath(visitingPath, n, ms);

        const pTag: HTMLParagraphElement = document.createElement("p") as HTMLParagraphElement;

        // Hiển thị đường đi ngắn nhất
        if (distances[t] !== OO) {
            minPath = getPathTo(t, parents);
            await setMinPath(minPath, n, ms);
            pTag.innerText = `Độ dài đường đi từ ${s} đến ${t} là: ${distances[t]}`;
        } else {
            pTag.innerText = `Không có đường đi từ ${s} đến ${t}`;
        }
        block_2.replaceChildren(pTag);
    }
}