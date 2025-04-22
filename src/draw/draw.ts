import { Size, Infor, Point } from "../type/common.types.js";
import { Container } from "../dom/domElements.js";
import { inforSelection } from "../constant/common.constant.js";

type HandleClickCell = (e: MouseEvent) => void;

// Tạo một hàng bằng DOM
function drawRow(idRow: number, rowSize: Size): HTMLDivElement {
    const row: HTMLDivElement = document.createElement("div");
    row.id = `row${idRow}`;
    row.classList.add("row");
    Object.assign(row.style, {
        height: `${rowSize.height}px`,
        width: `${rowSize.width}px`,
    });
    return row;
}

// Tạo một ô bằng DOM
function drawCell(idCell: string, cellSize: Size, inforCell: Infor): HTMLSpanElement {
    const cell: HTMLSpanElement = document.createElement("span");
    cell.id = idCell;
    cell.classList.add("cell");

    if (inforCell.weight <= 0) {
        // Chướng ngại vật trong mê cung
        cell.classList.add("obstacle");
        cell.title = `Chướng ngại vật ${inforCell.vertex} có trọng số là ${inforCell.weight}`;
    }
    else {
        // Không là chướng ngại vật: là đỉnh
        let data: number = 99;
        if (inforCell.mode === inforSelection.VERTEX)
            data = inforCell.vertex;
        else if (inforCell.mode === inforSelection.WEIGHT)
            data = inforCell.weight;
        else
            confirm("Lỗi xảy ra khi tạo một ô!");
        cell.innerText = `${data}`;
        cell.title = `Đỉnh ${inforCell.vertex} có trọng số là ${inforCell.weight}`;
    }
    Object.assign(cell.style, {
        height: `${cellSize.height}px`,
        width: `${cellSize.width}px`,
        fontSize: `${cellSize.fontSize}px`,
        // Canh chữ theo chiều dọc trong ô
        lineHeight: `${cellSize.height}px`,
    });
    return cell;
}

// Vẽ toàn bộ ma trận
export function drawGraph(viewMode: number, m: number, n: number, weightMatrix: Array<Array<number>>, handleClickCell: HandleClickCell): void {
    Container.replaceChildren();

    const containerSize: Size = {
        height: Container.clientHeight,
        width: Container.clientWidth
    }
    const rowSize: Size = {
        height: containerSize.height * 0.9 / weightMatrix.length,
        width: containerSize.width * 0.9
    }
    let cellSize: Size = {
        height: rowSize.height * 0.9,
        width: rowSize.width * 0.9 / weightMatrix[0].length,
    }
    cellSize = {
        ...cellSize,
        fontSize: ((cellSize.height < cellSize.width) ? cellSize.height : cellSize.width) * 0.8
    }

    for (let i = 0; i < m; i++) {
        const row: HTMLDivElement = drawRow(i, rowSize);
        // Duyệt qua từng cột/ ô trong 1 dòng
        for (let j = 0; j < n; j++) {
            const inforCell: Infor = {
                vertex: i * n + (j + 1),
                weight: weightMatrix[i][j],
                mode: viewMode,
            }
            // Để id là duy nhất
            const cell: HTMLSpanElement = drawCell(`${i}_${j}`, cellSize, inforCell);
            cell.onclick = (e) => {
                handleClickCell(e);
            }
            row.appendChild(cell);
        }
        Container.appendChild(row);
    }
}

function getPointFromVertex(u: number, n: number): Point {
    return {
        i: Math.floor((u - 1) / n),
        j: (u - 1) % n
    }
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Tô màu cho đường đi tới
export async function setVisitingPath(path: Array<number>, n: number, ms: number): Promise<void> {
    for (let u of path) {
        const uPoint: Point = getPointFromVertex(u, n);
        const cell: HTMLSpanElement = document.getElementById(`${uPoint.i}_${uPoint.j}`) as HTMLSpanElement;
        cell.classList.add("visiting");
        // nếu đặt trên có thể xảy ra mâu thuẫn khi dùng confirm ở hàm Dijsktra
        await delay(ms);
    }
}

// Xóa màu cho đường đi lùi
export async function resetVisitingPath(path: Array<number>, n: number, ms: number): Promise<void> {
    for (let u of path) {
        const uPoint: Point = getPointFromVertex(u, n);
        const cell: HTMLSpanElement = document.getElementById(`${uPoint.i}_${uPoint.j}`) as HTMLSpanElement;
        cell.classList.remove("visiting");
        // nếu đặt trên có thể xảy ra mâu thuẫn khi dùng confirm ở hàm Dijsktra
        await delay(ms);
    }
}

// Tô màu cho đường đi ngắn nhất
export async function setMinPath(path: Array<number>, n: number, ms: number): Promise<void> {
    for (let u of path) {
        const uPoint: Point = getPointFromVertex(u, n);
        const cell: HTMLSpanElement = document.getElementById(`${uPoint.i}_${uPoint.j}`) as HTMLSpanElement;
        cell.classList.add("minPath");
        await delay(ms);
    }
}

// Xóa màu cho đường đi ngắn nhất
export function resetMinPath(path: Array<number>, n: number): void {
    for (let u of path) {
        const uPoint: Point = getPointFromVertex(u, n);
        const cell: HTMLSpanElement = document.getElementById(`${uPoint.i}_${uPoint.j}`) as HTMLSpanElement;
        cell.classList.remove("minPath");
    }
}

// Tô màu cho các đỉnh lân cận
export async function colorizeNeighbors(neighbors: Array<number>, n: number, ms: number) {
    for (let u of neighbors) {
        const uPoint: Point = getPointFromVertex(u, n);
        const cell: HTMLSpanElement = document.getElementById(`${uPoint.i}_${uPoint.j}`) as HTMLSpanElement;
        cell.classList.add("neighbors");
    }
    await delay(ms);
}

// Xóa màu cho các đỉnh lân cận
export function deleteColorOfNeighbors(neighbors: Array<number>, n: number, ms: number) {
    for (let u of neighbors) {
        const uPoint: Point = getPointFromVertex(u, n);
        const cell: HTMLSpanElement = document.getElementById(`${uPoint.i}_${uPoint.j}`) as HTMLSpanElement;
        cell.classList.remove("neighbors");
    }
}

// Tô màu cho 1 đỉnh để thao tác
export async function showUpdateVertex(u: number, n: number, ms: number) {
    const uPoint: Point = getPointFromVertex(u, n);
    const cell: HTMLSpanElement = document.getElementById(`${uPoint.i}_${uPoint.j}`) as HTMLSpanElement;
    cell.classList.add("updating-vertex");
    await delay(ms);
}

// Xóa màu 1 đỉnh khi đã thao tác xong
export function hideUpdateVertex(u: number, n: number) {
    const uPoint: Point = getPointFromVertex(u, n);
    const cell: HTMLSpanElement = document.getElementById(`${uPoint.i}_${uPoint.j}`) as HTMLSpanElement;
    cell.classList.remove("updating-vertex");
}