import { setMinPath, resetMinPath, setVisitingPath, resetVisitingPath, showUpdateVertex, hideUpdateVertex, colorizeNeighbors, deleteColorOfNeighbors } from "./draw.js";

const OO: number = 999999999;
var minPath: Array<number> = [];

interface GraphType {
    getRowCount(): number,
    getColumnCount(): number,
    getVertices(): Array<number>,
    getNodeCount(): number,
    getNeighborsOf(u: number): Array<number>,
    adjacent(u: number, v: number): boolean,
    getWeightOfEdge(u: number, v: number): number,
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



export default async function Dijkstra(G: GraphType, s: number, t: number, ms: number): Promise<void> {
    const m: number = G.getRowCount();
    const n: number = G.getColumnCount();
    const block_1: HTMLDivElement = document.getElementById("block-1") as HTMLDivElement;
    const block_2: HTMLDivElement = document.getElementById("block-2") as HTMLDivElement;
    const block_3: HTMLDivElement = document.getElementById("block-3") as HTMLDivElement;
    // Làm mới minPath trước đó
    resetMinPath(minPath.reverse(), n)
    minPath = [];

    // Tập hợp chỉ chứa toàn đỉnh, không có chướng ngại vật
    const vertices: Array<number> = G.getVertices();
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
    const nodeCount: number = G.getNodeCount();
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
        let neighbors: Array<number> = G.getNeighborsOf(u);

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
                if (G.adjacent(u, v) && distances[u] + G.getWeightOfEdge(u, v) < distances[v]) {
                    distances[v] = distances[u] + G.getWeightOfEdge(u, v);
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