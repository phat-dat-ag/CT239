import Graph from "./Graph.js";
import { drawGraph } from "./draw.js";
import { drawVisGraph } from "./visGraph.js";
import Dijkstra from "./algoDijkstra.js";
import { ChuLiu } from "./algoChuLiuEdmonds.js";
import Tree_TSP from "./algoTSP.js";
import { All_Tree_DFS, Tree_DFS } from "./algoTreeDFS.js";
import { All_Tree_BFS, Tree_BFS } from "./algoTreeBFS.js";
import { All_Tree_Recursion, Tree_Recursion } from "./algoTreeRecursion.js";
import { Point } from "./type/common.types.js";
import { CreateMatrix, ViewMode, Algorithm, Pannel, MenuConfig, block_2 } from "./dom/domElements.js";
import { methodOptions, speedOptions, viewModeOptions, algorithmOptions } from "./constant/options.constant.js";
import { quickSelection, viewModeSelection, algorithmSelection, algorithmNeeds } from "./constant/common.constant.js";

var file: File | null = null;
var G = new Graph();
var globalPoint: Point = { i: 0, j: 0 };

// Chọn nhanh 1 đỉnh thay vì nhập
var selectedCell: HTMLSpanElement;
var activatedOnCell: number = quickSelection.NO_CHOICE;

// Chọn cách hiển thị ma trận
var selectedViewMode: number = viewModeSelection.WEIGHT_GRAPH;

// Chọn thuật toan
var selectedAlgorithm: number = algorithmSelection.DIJKSTRA;

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
for (let method of methodOptions) {
    const op: HTMLOptionElement = document.createElement("option") as HTMLOptionElement;
    op.value = `${method.methodID}`;
    op.innerText = method.title;
    CreateMatrix.selectTag.appendChild(op);
}
CreateMatrix.selectTag.onchange = (e: Event): void => {
    CreateMatrix.fileInput.replaceChildren();
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
        CreateMatrix.fileInput.appendChild(fileGroup);
    }
}

function turnOnSelectedCell() {
    selectedCell.classList.add("selected-cell");
}

function turnOffSelectedCell() {
    selectedCell.classList.remove("selected-cell");
}

// Hỗ trợ sinh ma trận: Hàm sự kiện click chọn 1 ô
function handleClickCell(e: Event): void {
    // Bật pannel lên
    turnOnDiv([Pannel.container]);
    Pannel.inforCell.replaceChildren();

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

    Pannel.weightInput.value = `${G.getWeightAtCell(globalPoint)}`;
    const n: number = G.getColumnCount();
    const vertex: number = getVertexFromPoint(globalPoint, n);
    Pannel.inforCell.innerHTML = `Ô <b style="color:red">${vertex}</b>, Tọa độ: (${globalPoint.i}, ${globalPoint.j})`;

    if (activatedOnCell === quickSelection.START)
        MenuConfig.startInput.value = `${vertex}`;
    if (activatedOnCell === quickSelection.END)
        MenuConfig.endInput.value = `${vertex}`;
    // Trả lại: chỉ cho phép chọn đỉnh bắt đầu/ kết thúc 1 lần thôi
    activatedOnCell = quickSelection.NO_CHOICE;
}

// Hỗ trợ sinh ma trận: Hàm đọc file
function readFileAsText(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject("Có lỗi khi đọc file");

        reader.readAsText(file);
    });
}

// Sinh ra ma trận
CreateMatrix.button.onclick = async function (): Promise<void> {
    // Tắt pannel mỗi khi random lại
    turnOffDiv([Pannel.container]);
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
        drawGraph(viewModeSelection.WEIGHT_GRAPH, m, n, weightMatrix, handleClickCell);
        // Đặt lại s và t
        s = 0;
        t = 0;
        // Đặt max và value cho start/ end vertex input
        MenuConfig.startInput.max = `${G.getNodeCount()}`;
        MenuConfig.startInput.value = `${s}`;
        MenuConfig.endInput.max = `${G.getNodeCount()}`;
        MenuConfig.endInput.value = `${t}`;
        // Bật Menu tùy chỉnh lên
        // Bật chức năng chọn chế độ xem lên
        // Bật chức năng chọn thuật toán lên
        turnOnDiv([MenuConfig.container, ViewMode.container, Algorithm.container]);
    } else {
        confirm("Ma trận không hợp lệ");
    }
}

// USE CASE 2: TÙY CHỌN TỐC ĐỘ MINH HỌA GIẢI THUẬT
var ms: number = 3000;
for (let option of speedOptions) {
    const op: HTMLOptionElement = document.createElement("option");
    op.value = `${option.speed}`;
    op.innerText = option.title;
    MenuConfig.speedSelectTag.appendChild(op);
}
MenuConfig.speedSelectTag.onchange = (e: Event): void => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    ms = parseInt(target.value);
}

var s: number | null = null, t: number | null = null;
// Thực thi giải thuật được chọn
MenuConfig.runButton.onclick = async (): Promise<void> => {
    // Xóa phần trình bày trước đó của thuật toán Moore Dijkstra
    block_2.replaceChildren();
    const nodeCount: number = G.getNodeCount();
    s = parseInt(MenuConfig.startInput.value);
    for (let algo of algorithmNeeds)
        if (selectedAlgorithm === algo)
            if (isNaN(s) || s <= 0 || s > nodeCount) {
                confirm("Đỉnh bắt đầu không hợp lệ!");
                return;
            }
    t = parseInt(MenuConfig.endInput.value);
    if (selectedAlgorithm === algorithmSelection.DIJKSTRA && (isNaN(t) || t <= 0 || t > nodeCount)) {
        confirm("Đỉnh kết thúc không hợp lệ!");
        return;
    }

    switch (selectedAlgorithm) {
        case algorithmSelection.DIJKSTRA:
            turnOffSelectedCell();
            await Dijkstra(G, s, t, ms);
            break;
        case algorithmSelection.SPANNING:
            ChuLiu(G, s);
            break;
        case algorithmSelection.TSP:
            Tree_TSP(G, s);
            break;
        case algorithmSelection.DFS:
            Tree_DFS(G, s);
            break;
        case algorithmSelection.BFS:
            Tree_BFS(G, s);
            break;
        case algorithmSelection.RECURSION:
            Tree_Recursion(G, s);
            break;
        case algorithmSelection.DFS_ALL:
            All_Tree_DFS(G);
            break;
        case algorithmSelection.BFS_ALL:
            All_Tree_BFS(G);
            break;
        case algorithmSelection.RECURSION_ALL:
            All_Tree_Recursion(G);
            break;
        default:
            confirm("Chưa hỗ trợ các chức năng còn lại");
    }
}

// USE CASE 3: CẬP NHẬT TRỌNG SỐ TRÊN GIAO DIỆN
Pannel.updateButton.onclick = function (e: Event): void {
    const selectedCellID: string = `${globalPoint.i}_${globalPoint.j}`
    const cell: HTMLSpanElement = document.getElementById(selectedCellID) as HTMLSpanElement;

    // Trọng số hiện tại
    const currentWeight: number = G.getWeightAtCell(globalPoint);
    // Trọng số mới
    const newWeight: number = parseInt(Pannel.weightInput.value);
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
MenuConfig.startClick.onclick = function () {
    activatedOnCell = quickSelection.START;
}

// Chọn đỉnh kết thúc thay vì nhập
MenuConfig.endClick.onclick = function () {
    activatedOnCell = quickSelection.END;
}

// USE CASE 4: ĐÓNG GIAO DIỆN CẬP NHẬT TRỌNG SỐ
Pannel.exitButton.onclick = (e: Event): void => {
    turnOffDiv([Pannel.container]);
    turnOffSelectedCell();
}

// USE CASE 5: CHỌN CHẾ ĐỘ XEM
for (let option of viewModeOptions) {
    const op: HTMLOptionElement = document.createElement("option") as HTMLOptionElement;
    op.value = `${option.viewMode}`;
    op.innerText = `${option.title}`;
    ViewMode.selectTag.appendChild(op);
}

ViewMode.selectTag.onchange = (e) => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    if (target.value === "weight")
        selectedViewMode = viewModeSelection.WEIGHT_GRAPH;
    else if (target.value === "graph")
        selectedViewMode = viewModeSelection.DIRECTED_GRAPH;
    else if (target.value === "vertex")
        selectedViewMode = viewModeSelection.VERTEX_GRAPH;
    else
        confirm("Lỗi chức năng chọn chế độ xem rồi!");
}

ViewMode.button.onclick = () => {
    const m: number = G.getRowCount();
    const n: number = G.getColumnCount();
    switch (selectedViewMode) {
        case viewModeSelection.WEIGHT_GRAPH:
            turnOnDiv([MenuConfig.container, Algorithm.container]);
            drawGraph(viewModeSelection.WEIGHT_GRAPH, m, n, G.getWeightMatrix(), handleClickCell);
            break;
        case viewModeSelection.VERTEX_GRAPH:
            turnOnDiv([MenuConfig.container, Algorithm.container]);
            drawGraph(viewModeSelection.VERTEX_GRAPH, m, n, G.getWeightMatrix(), handleClickCell);
            break;
        case viewModeSelection.DIRECTED_GRAPH:
            turnOffDiv([MenuConfig.container, Pannel.container, Algorithm.container]);
            drawVisGraph(G.getVertices(), G.getVertexMatrix());
            break;
        default:
            confirm("Lỗi chức năng hiển thị chế độ xem!")
            break;
    }
}

// USE CASE 6: CHỌN CHỨC NĂNG/ THUẬT TOÁN
for (let option of algorithmOptions) {
    const op: HTMLOptionElement = document.createElement("option") as HTMLOptionElement;
    op.value = `${option.algorithmID}`;
    op.innerText = `${option.title}`;
    Algorithm.selectTag.appendChild(op);
}

Algorithm.selectTag.onchange = (e) => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    selectedAlgorithm = parseInt(target.value);
}

function turnOffInputDiv() {
    MenuConfig.speedGroup.classList.remove("field-group");
    MenuConfig.speedGroup.classList.add("hide-div");
    MenuConfig.endGroup.classList.remove("field-group");
    MenuConfig.endGroup.classList.add("hide-div");
}

function turnOnInputDiv() {
    MenuConfig.speedGroup.classList.add("field-group");
    MenuConfig.speedGroup.classList.remove("hide-div");
    MenuConfig.endGroup.classList.add("field-group");
    MenuConfig.endGroup.classList.remove("hide-div");
}

Algorithm.button.onclick = () => {
    if (selectedAlgorithm === algorithmSelection.DIJKSTRA)
        turnOnInputDiv();
    else
        turnOffInputDiv();
}