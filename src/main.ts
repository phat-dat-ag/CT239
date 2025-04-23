import Graph from "./Graph.js";
import { drawGraph } from "./draw/draw.js";
import { drawVisGraph } from "./vis/visGraph.js";
import { Point } from "./type/common.types.js";
import { CreateMatrix, ViewMode, Algorithm, Pannel, MenuConfig } from "./dom/domElements.js";
import { methodOptions, speedOptions, viewModeOptions, algorithmOptions } from "./constant/options.constant.js";
import { quickSelection, viewModeSelection, algorithmSelection } from "./constant/common.constant.js";
import { getVertexFromPoint } from "./utils/calculate.utils.js";
import { turnOnSelectedCell, turnOffSelectedCell, turnOnDiv, turnOffDiv, turnOnInputDiv, turnOffInputDiv, createSelectTag, createFileGroup } from "./utils/ui.utils.js";
import { createMatrixFunc } from "./function/createMatrix.js";
import { runAlgorithm } from "./function/runAlgorithm.js";
import { updateWeight } from "./function/updateWeight.js";

var file: File | null = null;
var G = new Graph();
var globalPoint: Point = { i: 0, j: 0 };

// Chọn nhanh 1 đỉnh thay vì nhập
var selectedCell: HTMLSpanElement;
var activatedOnCell: number = quickSelection.NO_CHOICE;

// Chọn cách hiển thị ma trận
var selectedViewMode: number = viewModeSelection.WEIGHT_GRAPH;

// Chọn thuật toán
var selectedAlgorithm: number = algorithmSelection.DIJKSTRA;

// USE CASE 1: TÙY CHỌN CÁCH SINH RA MA TRẬN
createSelectTag(methodOptions, CreateMatrix.selectTag);

CreateMatrix.selectTag.onchange = (e: Event): void => {
    CreateMatrix.fileInput.replaceChildren();
    const target = e.target as HTMLSelectElement;
    const methodID = parseInt(target.value);

    if (methodID === 0) file = null;
    else {
        // Dùng Callback tại đây: truyền vào 1 hàm như tham số
        // Anonymous function: hàm ẩn danh
        // Khai báo ngay tại chỗ truyền vào như 1 tham số
        // Tuy không khai báo như bth, nhưng nó vẫn là hàm, và được gọi như bình thường
        // Có thể tách ra cho rõ
        const fileGroup: HTMLDivElement = createFileGroup((selectedFile: File) => {
            file = selectedFile;
        });
        CreateMatrix.fileInput.appendChild(fileGroup);
    }
}

// Hỗ trợ sinh ma trận: Hàm sự kiện click chọn 1 ô
function handleClickCell(e: Event) {
    turnOnDiv([Pannel.container]);
    Pannel.inforCell.replaceChildren();

    const target = e.target as HTMLSpanElement;
    const cell: HTMLSpanElement = document.getElementById(target.id) as HTMLSpanElement;

    // cell được chọn trước đó => xóa màu
    if (selectedCell)
        turnOffSelectedCell(selectedCell);

    // Gắn cell hiện tại lên global
    selectedCell = cell;
    turnOnSelectedCell(selectedCell);

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

// Sinh ra ma trận
CreateMatrix.button.onclick = async () => {
    await createMatrixFunc(file, G, s, t, Pannel, MenuConfig, ViewMode, Algorithm, handleClickCell);
}

// USE CASE 2: TÙY CHỌN TỐC ĐỘ MINH HỌA GIẢI THUẬT
var ms: number = 3000;
createSelectTag(speedOptions, MenuConfig.speedSelectTag);

MenuConfig.speedSelectTag.onchange = (e: Event): void => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    ms = parseInt(target.value);
}

var s: number | null = null, t: number | null = null;
// Thực thi giải thuật được chọn
MenuConfig.runButton.onclick = async () => {
    await runAlgorithm(G, s, t, ms, selectedAlgorithm, selectedCell);
}

// USE CASE 3: CẬP NHẬT TRỌNG SỐ TRÊN GIAO DIỆN
Pannel.updateButton.onclick = () => {
    updateWeight(globalPoint, G, Pannel);
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
    turnOffSelectedCell(selectedCell);
}

// USE CASE 5: CHỌN CHẾ ĐỘ XEM
createSelectTag(viewModeOptions, ViewMode.selectTag);

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
createSelectTag(algorithmOptions, Algorithm.selectTag);

Algorithm.selectTag.onchange = (e) => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    selectedAlgorithm = parseInt(target.value);
}

Algorithm.button.onclick = () => {
    if (selectedAlgorithm === algorithmSelection.DIJKSTRA)
        turnOnInputDiv(MenuConfig);
    else
        turnOffInputDiv(MenuConfig);
}