import Graph from "./Graph.js";
import { drawGraph } from "./draw.js";
import { drawVisGraph } from "./visGraph.js";
import Dijkstra from "./algoDijkstra.js";
import Tree_BFS from "./TreeBFS.js";
import Tree_DFS from "./TreeDFS.js";

interface Point {
    i: number;
    j: number;
}

interface Option {
    methodID?: string;
    speed?: number;
    viewMode?: string;
    algorithmID?: number;
    title: string;
}

var file: File | null = null;
var G = new Graph();
var globalPoint: Point = { i: 0, j: 0 };

const container: HTMLDivElement = document.getElementById("container") as HTMLDivElement;
// Bảng điều khiển
const methodSelect: HTMLSelectElement = document.getElementById("method-select") as HTMLSelectElement;
const fileInputArea: HTMLDivElement = document.getElementById("file-input-area") as HTMLDivElement;
const createMatrixButton: HTMLButtonElement = document.getElementById("create-matrix-button") as HTMLButtonElement;
const viewModeArea: HTMLDivElement = document.getElementById("view-mode") as HTMLDivElement;
const algorithmArea: HTMLDivElement = document.getElementById("algorithm-option") as HTMLDivElement;
const viewModeSelect: HTMLSelectElement = document.getElementById("view-mode-select") as HTMLSelectElement;
const selectViewModeButton: HTMLButtonElement = document.getElementById("select-view") as HTMLButtonElement;
const algorithmSelect: HTMLSelectElement = document.getElementById("algorithm-select") as HTMLSelectElement;
const selectAlgorithmButton: HTMLButtonElement = document.getElementById("select-algorithm") as HTMLButtonElement;
const pannel: HTMLDivElement = document.getElementById("pannel") as HTMLDivElement;
const inforCell: HTMLParagraphElement = document.getElementById("infor-cell") as HTMLParagraphElement;
const weightInput: HTMLInputElement = document.getElementById("weight-input") as HTMLInputElement;
const updateWeightButton: HTMLButtonElement = document.getElementById("updat-weight-button") as HTMLButtonElement;
const exitButton: HTMLButtonElement = document.getElementById("exit-button") as HTMLButtonElement;
// Menu tùy chỉnh
const menu: HTMLDivElement = document.getElementById("menu") as HTMLDivElement;
const speedSelectTag: HTMLSelectElement = document.getElementById("speed-select") as HTMLSelectElement;
const startVertexInput: HTMLInputElement = document.getElementById("start-vertex-input") as HTMLInputElement;
const startVertexClick: HTMLButtonElement = document.getElementById("start") as HTMLButtonElement;
const endVertexInput: HTMLInputElement = document.getElementById("end-vertex-input") as HTMLInputElement;
const endVertexClick: HTMLButtonElement = document.getElementById("end") as HTMLButtonElement;
const algorithmRunButton: HTMLButtonElement = document.getElementById("algorithm-run") as HTMLButtonElement;

// Hai trường dữ liệu cần ẩn/ tắt với từng loại thuật toán
// Riêng nhập đỉnh bắt đầu là luôn cần có
const speedInputDiv: HTMLDivElement = document.getElementById("speed-field-group") as HTMLDivElement;
const endInputDiv: HTMLDivElement = document.getElementById("end-vertex-field-group") as HTMLDivElement;

var selectedCell: HTMLSpanElement;
const START: number = 1;
const END: number = 2;
const NO_CHOICE: number = -1
var activatedOnCell: number = NO_CHOICE;

const WEIGHT: number = 1;
const VERTEX: number = 2;
const GRAPH: number = 3;
var selectedViewMode: number = WEIGHT;

const DIJKSTRA: number = 1;
const SPANNING: number = 2;
const TSP: number = 3;
const DFS: number = 4;
const BFS: number = 5;
var selectedAlgorithm: number = 1;

// Hiển thị thẻ div đã bị ẩn lên
function turnOnDiv(divs: Array<HTMLDivElement>) {
    for (let div of divs) {
        div.classList.add("turn-on");
        div.classList.remove("hide-div");
    }
}

// Ẩn thẻ div đang được hiển thị
function turnOffDiv(divs: Array<HTMLDivElement>) {
    for (let div of divs) {
        div.classList.remove("turn-on");
        div.classList.add("hide-div");
    }
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

// USE CASE 1: TÙY CHỌN CÁCH SINH RA MA TRẬN
const methodOptions: Array<Option> = [
    { methodID: "0", title: "Ngẫu nhiên" },
    { methodID: "1", title: "Đọc file" },
]
for (let method of methodOptions) {
    const op: HTMLOptionElement = document.createElement("option") as HTMLOptionElement;
    op.value = `${method.methodID}`;
    op.innerText = method.title;
    methodSelect.appendChild(op);
}
methodSelect.onchange = (e: Event): void => {
    fileInputArea.replaceChildren();
    const target = e.target as HTMLSelectElement;
    const methodID = parseInt(target.value);

    if (methodID === 0) file = null;
    else if (methodID === 1) {
        const input: HTMLInputElement = document.createElement("input");
        input.id = "file-input"
        input.type = "file";
        input.accept = ".txt";

        const fileGroup: HTMLDivElement = document.createElement("div");
        fileGroup.classList.add("field-group");
        fileGroup.appendChild(input);
        // Sự kiện thay đổi file
        input.onchange = (e: Event): void => {
            const target: HTMLInputElement = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0)
                file = target.files[0];
        }
        fileInputArea.appendChild(fileGroup);
    }
}

function turnOnSelectedCell() {
    selectedCell.classList.add("selected-cell");
}

function turnOffSelectedCell() {
    selectedCell.classList.remove("selected-cell");
}

// Dùng trong createMatrixButton: Hàm sự kiện click chọn 1 ô
function handleClickCell(e: Event): void {
    // Bật pannel lên
    turnOnDiv([pannel]);
    inforCell.replaceChildren();

    const target = e.target as HTMLSpanElement;
    const cell: HTMLSpanElement = document.getElementById(target.id) as HTMLSpanElement;

    // cell được chọn trước đó => xóa màu
    if (selectedCell)
        turnOffSelectedCell();

    // Gắn cell hiện tại lên global
    selectedCell = cell;
    turnOnSelectedCell();

    // Lấy tọa độ từ id đã đặt trước đó
    let [i, j]: Array<string> = cell.id.split("_");
    globalPoint = {
        i: parseInt(i),
        j: parseInt(j)
    }

    weightInput.value = `${G.getWeightAtCell(globalPoint)}`;
    const n: number = G.getColumnCount();
    const vertex: number = getVertexFromPoint(globalPoint, n);
    inforCell.innerHTML = `Ô <b style="color:red">${vertex}</b>, Tọa độ: (${globalPoint.i}, ${globalPoint.j})`;

    if (activatedOnCell === START)
        startVertexInput.value = `${vertex}`;
    if (activatedOnCell === END)
        endVertexInput.value = `${vertex}`;
    // Trả lại: chỉ cho phép chọn đỉnh bắt đầu/ kết thúc 1 lần thôi
    activatedOnCell = NO_CHOICE;
}

// Dùng trong createMatrixButton: Hàm đọc file
function readFileAsText(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject("Có lỗi khi đọc file");

        reader.readAsText(file);
    });
}

// Sinh ra ma trận
createMatrixButton.onclick = async function (): Promise<void> {
    // Tắt pannel mỗi khi random lại
    turnOffDiv([pannel]);
    let matrix: Array<Array<number>> = [];

    if (file) {
        try {
            const content: string = await readFileAsText(file);
            // Tách thành danh sách các dòng
            const rows: Array<string> = content.split("\n");
            let stringArray: Array<string>;
            for (let row of rows) {
                let rowOfMatrix: Array<number> = [];
                stringArray = row.split(" ");
                for (let str of stringArray)
                    rowOfMatrix.push(parseInt(str));
                matrix.push(rowOfMatrix);
            }
        } catch (err) {
            console.log("Lỗi đọc file: ", err);
        }
    } else {
        const rowCount: number = randomFromZeroTo(3) + 5;
        const columnCount: number = randomFromZeroTo(3) + 5;
        for (let i = 0; i < rowCount; i++) {
            let row: Array<number> = [];
            for (let j = 0; j < columnCount; j++) {
                // Random dấu trước: xác suất 20% dấu âm
                const sign: number = (randomFromZeroTo(10) <= 2) ? -1 : 1;
                // Phạm vi -99<=...<=99
                row.push(sign * randomFromZeroTo(99));
            }
            matrix.push(row);
        }
    }
    if (checkInput(matrix)) {
        // Class Graph chính thức được tạo
        G.buildGraph(matrix);
        const m: number = G.getRowCount();
        const n: number = G.getColumnCount();
        const weightMatrix: Array<Array<number>> = G.getWeightMatrix();
        drawGraph(WEIGHT, container, m, n, weightMatrix, handleClickCell);
        // Đặt lại s và t
        s = 0;
        t = 0;
        // Đặt max và value cho start/ end vertex input
        startVertexInput.max = `${G.getNodeCount()}`;
        startVertexInput.value = `${s}`;
        endVertexInput.max = `${G.getNodeCount()}`;
        endVertexInput.value = `${t}`;
        // Bật Menu tùy chỉnh lên
        // Bật chức năng chọn chế độ xem lên
        // Bật chức năng chọn thuật toán lên
        turnOnDiv([menu, viewModeArea, algorithmArea]);
    } else {
        confirm("Ma trận không hợp lệ");
    }
}

// USE CASE 2: TÙY CHỌN TỐC ĐỘ MINH HỌA GIẢI THUẬT
var ms: number = 3000;

const speedOptions: Array<Option> = [
    { speed: 3000, title: "Rất chậm" },
    { speed: 2000, title: "Chậm" },
    { speed: 1000, title: "Bình thường" },
    { speed: 100, title: "Nhanh" },
    { speed: 10, title: "Rất nhanh" }
]
for (let option of speedOptions) {
    const op: HTMLOptionElement = document.createElement("option");
    op.value = `${option.speed}`;
    op.innerText = option.title;
    speedSelectTag.appendChild(op);
}
speedSelectTag.onchange = (e: Event): void => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    ms = parseInt(target.value);
}

var s: number | null = null, t: number | null = null;
// Thực thi giải thuật được chọn
algorithmRunButton.onclick = async (e: Event): Promise<void> => {
    s = parseInt(startVertexInput.value);
    if (isNaN(s) || s === 0) {
        confirm("Đỉnh bắt đầu không hợp lệ!");
        return;
    }
    switch (selectedAlgorithm) {
        case DIJKSTRA:
            t = parseInt(endVertexInput.value);
            if (isNaN(t) || t === 0) {
                confirm("Đỉnh kết thúc không hợp lệ!");
                return;
            }
            turnOffSelectedCell();
            await Dijkstra(G, s, t, ms);
            break;
        case DFS:
            Tree_DFS(container, G, s);
            break;
        case BFS:
            Tree_BFS(container, G, s);
            break;
        default:
            confirm("Chưa hỗ trợ các chức năng còn lại");
    }

}

// USE CASE 3: CẬP NHẬT TRỌNG SỐ TRÊN GIAO DIỆN
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
    // Cập nhật lại title cho cell
    if (newWeight > 0)
        cell.title = `Đỉnh ${u} có trọng số là ${newWeight}`;
    else
        cell.title = `Chướng ngại vật ${u} có trọng số là ${newWeight}`;
}

// Chọn đỉnh bắt đầu thay vì nhập
startVertexClick.onclick = function () {
    activatedOnCell = START;
}

// Chọn đỉnh kết thúc thay vì nhập
endVertexClick.onclick = function () {
    activatedOnCell = END;
}

// USE CASE 4: ĐÓNG GIAO DIỆN CẬP NHẬT TRỌNG SỐ
exitButton.onclick = (e: Event): void => {
    turnOffDiv([pannel]);
    turnOffSelectedCell();
}

// USE CASE 5: CHỌN CHẾ ĐỘ XEM
const viewModeOptions: Array<Option> = [
    { viewMode: "weight", title: "Ma trận với trọng số" },
    { viewMode: "vertex", title: "Ma trận số thứ tự đỉnh" },
    { viewMode: "graph", title: "Đồ thị minh họa" }
];

for (let option of viewModeOptions) {
    const op: HTMLOptionElement = document.createElement("option") as HTMLOptionElement;
    op.value = `${option.viewMode}`;
    op.innerText = `${option.title}`;
    viewModeSelect.appendChild(op);
}

viewModeSelect.onchange = (e) => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    if (target.value === "weight")
        selectedViewMode = WEIGHT;
    else if (target.value === "graph")
        selectedViewMode = GRAPH;
    else if (target.value === "vertex")
        selectedViewMode = VERTEX;
    else
        confirm("Lỗi chức năng chọn chế độ xem rồi!");
}

selectViewModeButton.onclick = () => {
    const m: number = G.getRowCount();
    const n: number = G.getColumnCount();
    switch (selectedViewMode) {
        case WEIGHT:
            turnOnDiv([menu, algorithmArea]);
            drawGraph(WEIGHT, container, m, n, G.getWeightMatrix(), handleClickCell);
            break;
        case VERTEX:
            turnOnDiv([menu, algorithmArea]);
            drawGraph(VERTEX, container, m, n, G.getWeightMatrix(), handleClickCell);
            break;
        case GRAPH:
            turnOffDiv([menu, pannel, algorithmArea]);
            drawVisGraph(container, G.getVertices(), G.getVertexMatrix());
            break;
        default:
            confirm("Lỗi chức năng hiển thị chế độ xem!")
            break;
    }
}

// USE CASE 6: CHỌN CHỨC NĂNG/ THUẬT TOÁN
const algorithmOptions: Array<Option> = [
    { algorithmID: 1, title: "Moore Dijkstra" },
    { algorithmID: 2, title: "Cây phủ tối thiểu" },
    { algorithmID: 3, title: "Bài toán TSP" },
    { algorithmID: 4, title: "Cây duyệt DFS" },
    { algorithmID: 5, title: "Cây duyệt BFS" },
];

for (let option of algorithmOptions) {
    const op: HTMLOptionElement = document.createElement("option") as HTMLOptionElement;
    op.value = `${option.algorithmID}`;
    op.innerText = `${option.title}`;
    algorithmSelect.appendChild(op);
}

algorithmSelect.onchange = (e) => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    selectedAlgorithm = parseInt(target.value);
}

function turnOffInputDiv() {
    speedInputDiv.classList.remove("field-group");
    speedInputDiv.classList.add("hide-div");
    endInputDiv.classList.remove("field-group");
    endInputDiv.classList.add("hide-div");
}

function turnOnInputDiv() {
    speedInputDiv.classList.add("field-group");
    speedInputDiv.classList.remove("hide-div");
    endInputDiv.classList.add("field-group");
    endInputDiv.classList.remove("hide-div");
}

selectAlgorithmButton.onclick = () => {
    if (selectedAlgorithm === DIJKSTRA)
        turnOnInputDiv();
    else
        turnOffInputDiv();
}