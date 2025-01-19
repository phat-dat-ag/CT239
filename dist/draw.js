var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Tạo một hàng bằng DOM
function drawRow(idRow, rowSize) {
    const row = document.createElement("div");
    row.id = `row${idRow}`;
    row.classList.add("row");
    Object.assign(row.style, {
        height: `${rowSize.height}px`,
        width: `${rowSize.width}px`,
    });
    return row;
}
// Tạo một ô bằng DOM
function drawCell(idCell, cellSize, inforCell) {
    const cell = document.createElement("span");
    cell.id = idCell;
    cell.classList.add("cell");
    if (inforCell.weight <= 0) {
        // Chướng ngại vật trong mê cung
        cell.classList.add("obstacle");
        cell.title = `Chướng ngại vật ${inforCell.vertex} có trọng số là ${inforCell.weight}`;
    }
    else {
        // Không là chướng ngại vật: là đỉnh
        cell.innerText = `${inforCell.weight}`;
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
export function drawGraph(container, m, n, weightMatrix, handleClickCell) {
    container.replaceChildren();
    const containerSize = {
        height: container.clientHeight,
        width: container.clientWidth
    };
    const rowSize = {
        height: containerSize.height * 0.9 / weightMatrix.length,
        width: containerSize.width * 0.9
    };
    let cellSize = {
        height: rowSize.height * 0.9,
        width: rowSize.width * 0.9 / weightMatrix[0].length,
    };
    cellSize = Object.assign(Object.assign({}, cellSize), { fontSize: ((cellSize.height < cellSize.width) ? cellSize.height : cellSize.width) * 0.8 });
    for (let i = 0; i < m; i++) {
        const row = drawRow(i, rowSize);
        // Duyệt qua từng cột/ ô trong 1 dòng
        for (let j = 0; j < n; j++) {
            const inforCell = {
                vertex: i * n + (j + 1),
                weight: weightMatrix[i][j]
            };
            // Để id là duy nhất
            const cell = drawCell(`${i}_${j}`, cellSize, inforCell);
            cell.onclick = (e) => {
                handleClickCell(e);
            };
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}
function getPointFromVertex(u, n) {
    return {
        i: Math.floor((u - 1) / n),
        j: (u - 1) % n
    };
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// Tô màu cho đường đi tới
export function setVisitingPath(path, n, ms) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let u of path) {
            const uPoint = getPointFromVertex(u, n);
            const cell = document.getElementById(`${uPoint.i}_${uPoint.j}`);
            cell.classList.add("visiting");
            // nếu đặt trên có thể xảy ra mâu thuẫn khi dùng confirm ở hàm Dijsktra
            yield delay(ms);
        }
    });
}
// Xóa màu cho đường đi lùi
export function resetVisitingPath(path, n, ms) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let u of path) {
            const uPoint = getPointFromVertex(u, n);
            const cell = document.getElementById(`${uPoint.i}_${uPoint.j}`);
            cell.classList.remove("visiting");
            // nếu đặt trên có thể xảy ra mâu thuẫn khi dùng confirm ở hàm Dijsktra
            yield delay(ms);
        }
    });
}
// Tô màu cho đường đi ngắn nhất
export function setMinPath(path, n, ms) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let u of path) {
            const uPoint = getPointFromVertex(u, n);
            const cell = document.getElementById(`${uPoint.i}_${uPoint.j}`);
            cell.classList.add("minPath");
            yield delay(ms);
        }
    });
}
// Xóa màu cho đường đi ngắn nhất
export function resetMinPath(path, n) {
    for (let u of path) {
        const uPoint = getPointFromVertex(u, n);
        const cell = document.getElementById(`${uPoint.i}_${uPoint.j}`);
        cell.classList.remove("minPath");
    }
}
