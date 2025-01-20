import Graph from "./Graph.js";
import { drawGraph } from "./draw.js";

interface Point {
    i: number;
    j: number;
}

interface Speed {
    speed: number;
    title: string;
}

var G = new Graph();
var globalPoint: Point = { i: 0, j: 0 };
var s: number = 0, t: number = 0;
var ms: number = 2000;

const container: HTMLDivElement = document.getElementById("container") as HTMLDivElement;
// Bảng điều khiển
const randomMatrixButton: HTMLButtonElement = document.getElementById("random-matrix-button") as HTMLButtonElement;
const pannel: HTMLDivElement = document.getElementById("pannel") as HTMLDivElement;
const inforCell: HTMLParagraphElement = document.getElementById("infor-cell") as HTMLParagraphElement;
const weightInput: HTMLInputElement = document.getElementById("weight-input") as HTMLInputElement;
const updateWeightButton: HTMLButtonElement = document.getElementById("updat-weight-button") as HTMLButtonElement;
// Menu tùy chỉnh
const menu: HTMLDivElement = document.getElementById("menu") as HTMLDivElement;
const speedSelectTag: HTMLSelectElement = document.getElementById("speed-select") as HTMLSelectElement;
const startVertexInput: HTMLInputElement = document.getElementById("start-vertex-input") as HTMLInputElement;
const endVertexInput: HTMLInputElement = document.getElementById("end-vertex-input") as HTMLInputElement;
const runDijkstraButton: HTMLButtonElement = document.getElementById("run-Dijkstra-button") as HTMLButtonElement;

// Xử lý nhập s
startVertexInput.onchange = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    s = parseInt(target.value);
    startVertexInput.value = target.value;
}
// Xử lý nhập t
endVertexInput.onchange = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    t = parseInt(target.value);
    endVertexInput.value = target.value;
}


function randomFromZeroTo(number: number): number {
    if (number <= 0)
        return 0;
    return Math.round(Math.random() * number);
};

function getVertexFromPoint(point: Point, n: number): number {
    return point.i * n + (point.j + 1);
}

function checkInput(matrix: Array<Array<number>>): boolean {
    const columnAmount: number = matrix[0].length;
    for (let i = 0; i < matrix.length; i++)
        if (matrix[i].length !== columnAmount)
            return false;
    return true;
}

// Sự kiện click chọn 1 ô
function handleClickCell(e: Event): void {
    pannel.classList.add("turn-on");
    inforCell.replaceChildren();

    const target = e.target as HTMLSpanElement;
    const cell: HTMLSpanElement = document.getElementById(target.id) as HTMLSpanElement;
    // Lấy tọa độ từ id đã đặt trước đó
    let [i, j]: Array<string> = cell.id.split("_");
    globalPoint = {
        i: parseInt(i),
        j: parseInt(j)
    }

    weightInput.value = `${G.getWeightAtCell(globalPoint)}`;
    const n: number = G.getColumnCount();
    const vertex: number = getVertexFromPoint(globalPoint, n);
    inforCell.innerText = `Ô ${vertex}, Tọa độ: (${globalPoint.i}, ${globalPoint.j})`;
}

// Random ra ma trận
randomMatrixButton.onclick = function (): void {
    // Tắt pannel mỗi khi random lại
    pannel.classList.remove("turn-on");

    const rowCount: number = randomFromZeroTo(3) + 5;
    const columnCount: number = randomFromZeroTo(3) + 5;
    let matrix: Array<Array<number>> = [];
    for (let i = 0; i < rowCount; i++) {
        let row: Array<number> = [];
        for (let j = 0; j < columnCount; j++) {
            // Random dấu trước: xác suất 30% dấu âm
            const sign: number = (randomFromZeroTo(10) <= 3) ? -1 : 1;
            // Phạm vi -99<=...<=99
            row.push(sign * randomFromZeroTo(99));
        }
        matrix.push(row);
    }
    if (checkInput(matrix)) {
        // Class Graph chính thức được tạo
        G.buildGraph(matrix);
        const m: number = G.getRowCount();
        const n: number = G.getColumnCount();
        const weightMatrix: Array<Array<number>> = G.getWeightMatrix();
        drawGraph(container, m, n, weightMatrix, handleClickCell);
        // Cập nhật max trong ô input s và t
        startVertexInput.max = `${m * n}`;
        startVertexInput.value = "0";
        endVertexInput.max = `${m * n}`;
        endVertexInput.value = "0";
        // Bật Menu tùy chỉnh lên
        menu.classList.add("turn-on");
    } else {
        confirm("Ma trận không hợp lệ");
    }
}

const speedOptions: Array<Speed> = [
    { speed: 2000, title: "Rất chậm" },
    { speed: 1000, title: "Chậm" },
    { speed: 500, title: "Bình thường" },
    { speed: 100, title: "Nhanh" },
    { speed: 10, title: "Rất nhanh" }
]

// Cập nhật thẻ select chọn tốc độ
for (let option of speedOptions) {
    const op: HTMLOptionElement = document.createElement("option");
    op.value = `${option.speed}`;
    op.innerText = option.title;
    speedSelectTag.appendChild(op);
}

speedSelectTag.onchange = (e: Event): void => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    ms = parseInt(target.value)
}

// Thực thi thuật toán Moore Dijkstra
runDijkstraButton.onclick = function (): void {
    // typeof NaN là number nên không thể kiểm tra typeof
    if (isNaN(s))
        confirm("Đỉnh bắt đầu không hợp lệ");
    else if (isNaN(t))
        confirm("Đỉnh kết thúc không hợp lệ");
    else
        G.Dijkstra(s, t, ms);
}

// Cập nhật trọng số
updateWeightButton.onclick = function (e: Event): void {
    const selectedCellID: string = `${globalPoint.i}_${globalPoint.j}`
    const cell: HTMLSpanElement = document.getElementById(selectedCellID) as HTMLSpanElement;

    // Trọng số hiện tại
    const currentWeight: number = G.getWeightAtCell(globalPoint);
    // Trọng số mới
    const newWeight: number = parseInt(weightInput.value);
    // typeof NaN là number nên không thể kiểm tra typeof
    if (isNaN(newWeight)) {
        confirm("Trọng số không hợp lệ");
        return;
    }

    // Khi cả 2 bằng nhau => Bỏ qua
    if (currentWeight === newWeight) {
        return;
    }
    const n: number = G.getColumnCount();
    const u: number = getVertexFromPoint(globalPoint, n);
    // Cập nhật ma trận trọng số
    G.setWeightMatrixAt(globalPoint, newWeight);

    function obstacleToVertex(u: number, cell: HTMLSpanElement): void {
        G.updateEdgesFromNode(u);
        G.updateEdgesToNode(u);
        cell.innerText = `${newWeight}`;
        cell.classList.remove("obstacle");
    }

    function vertexToObstacle(u: number, cell: HTMLSpanElement): void {
        G.removeEdgesOfNode(u);
        cell.innerText = "";
        cell.classList.add("obstacle");
    }

    // Cả 2 không thể bằng nhau

    // Cả 2 đều cùng dấu => cùng tính chất
    if (currentWeight * newWeight > 0) {
        if (currentWeight > 0) {
            // Đều là đỉnh: chỉ cần cập nhật cung tới đỉnh đó
            G.updateEdgesToNode(u);
            cell.innerText = `${newWeight}`;
        } else if (currentWeight < 0) {
            // Đều là chướng ngại vật
            // Chỉ cần cập nhật trong ma trận tọng số là đủ
        }
    } else if (currentWeight * newWeight === 0) {
        // Cả 2 KHÔNG đồng thời bằng 0
        if (currentWeight === 0) {
            // currentWeight = 0 thì newWeight khác 0
            if (newWeight > 0) {
                // Chướng ngại vật => Đỉnh
                obstacleToVertex(u, cell);
            } else {
                // Đều là chướng ngại vật
                // Chỉ cần cập nhật trong ma trận tọng số là đủ
            }
        } else {
            // currentWeight khác 0 thì newWeight = 0
            if (currentWeight > 0) {
                // Đỉnh => Chướng ngại vật
                vertexToObstacle(u, cell);
            } else {
                // Đều là chướng ngại vật
                // Chỉ cần cập nhật trong ma trận tọng số là đủ
            }
        }
    } else {
        // Cả 2 đều trái dấu => trái tính chất
        if (currentWeight < 0) {
            // Chướng ngại vật => Đỉnh
            obstacleToVertex(u, cell);
        } else {
            // Đỉnh => Chướng ngại vật
            vertexToObstacle(u, cell);
        }
    }
}

