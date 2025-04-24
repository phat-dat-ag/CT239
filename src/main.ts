import Graph from "./graph/AdjacencyMatrixGraph.js";
import { Point } from "./type/common.types.js";
import { CreateMatrix, ViewMode, Algorithm, Pannel, MenuConfig } from "./dom/domElements.js";
import { methodOptions, speedOptions, viewModeOptions, algorithmOptions } from "./constant/options.constant.js";
import { quickSelection, viewModeSelection, algorithmSelection } from "./constant/common.constant.js";
import { turnOnSelectedCell, turnOffSelectedCell, createSelectTag } from "./utils/ui.utils.js";
import { createMatrixFunc } from "./function/createMatrix.js";
import { runAlgorithm } from "./function/runAlgorithm.js";
import { updateWeight } from "./function/updateWeight.js";
import { handleClickOneCell, handleClickViewModeButton, handleClickAlgorithmButton, handleClickExitButton } from "./event/onclick.event.js";
import { handleOptionChange, handleCreateMatrixMethodChange } from "./event/onchange.event.js";

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
    // Có dùng callback lồng trong callback: hàm setFile
    // Dùng Callback tại đây: truyền vào 1 hàm như tham số
    // Anonymous function: hàm ẩn danh
    // Khai báo ngay tại chỗ truyền vào như 1 tham số
    // Tuy không khai báo như bth, nhưng nó vẫn là hàm, và được gọi như bình thường
    // Có thể tách ra cho rõ
    handleCreateMatrixMethodChange(e, CreateMatrix, (selectedFile: File | null) => {
        file = selectedFile;
    });
}

// Hỗ trợ sinh ma trận: Hàm sự kiện click chọn 1 ô
function handleClickCell(e: Event): void {
    handleClickOneCell(activatedOnCell, MenuConfig, e, G, Pannel, (cell: HTMLSpanElement, point: Point) => {
        // Xóa màu ô được chọn trước đó
        if (selectedCell)
            turnOffSelectedCell(selectedCell);
        // Gắn ô hiện tại lên global
        selectedCell = cell;
        globalPoint = { ...point };
        // Đánh dấu ô đang chọn
        turnOnSelectedCell(selectedCell);
        // Trả lại: chỉ cho phép chọn đỉnh bắt đầu/ kết thúc 1 lần thôi
        activatedOnCell = quickSelection.NO_CHOICE;
    });
}

// Sinh ra ma trận
CreateMatrix.button.onclick = async () => {
    // Truyền vào 2 hàm callback luôn
    await createMatrixFunc(file, G, s, t, Pannel, MenuConfig, ViewMode, Algorithm, handleClickCell, () => {
        s = 0;
        t = 0;
    });
}

// USE CASE 2: CẬP NHẬT TRỌNG SỐ TRÊN GIAO DIỆN
Pannel.updateButton.onclick = () => {
    updateWeight(globalPoint, G, Pannel);
}

// USE CASE 3: ĐÓNG GIAO DIỆN CẬP NHẬT TRỌNG SỐ
Pannel.exitButton.onclick = () => {
    handleClickExitButton(Pannel, selectedCell);
}

// USE CASE 4: CHỌN CHẾ ĐỘ XEM
createSelectTag(viewModeOptions, ViewMode.selectTag);

ViewMode.selectTag.onchange = (e: Event) => {
    selectedViewMode = handleOptionChange(e);
}

ViewMode.button.onclick = () => {
    handleClickViewModeButton(G, selectedViewMode, MenuConfig, Algorithm, Pannel, handleClickCell);
}

// USE CASE 5: CHỌN CHỨC NĂNG/ THUẬT TOÁN
createSelectTag(algorithmOptions, Algorithm.selectTag);

Algorithm.selectTag.onchange = (e: Event) => {
    selectedAlgorithm = handleOptionChange(e);
}

Algorithm.button.onclick = () => {
    handleClickAlgorithmButton(selectedAlgorithm, MenuConfig);
}

// USE CASE 6: NHẬP DỮ LIỆU CHO GIẢI THUẬT VÀ THỰC THI

// Chọn đỉnh bắt đầu thay vì nhập
MenuConfig.startClick.onclick = function () {
    activatedOnCell = quickSelection.START;
}

// Chọn đỉnh kết thúc thay vì nhập
MenuConfig.endClick.onclick = function () {
    activatedOnCell = quickSelection.END;
}

var ms: number = 3000;
createSelectTag(speedOptions, MenuConfig.speedSelectTag);

MenuConfig.speedSelectTag.onchange = (e: Event): void => {
    ms = handleOptionChange(e);
}

var s: number | null = null, t: number | null = null;

// Thực thi giải thuật được chọn
MenuConfig.runButton.onclick = async () => {
    await runAlgorithm(G, s, t, ms, selectedAlgorithm, selectedCell);
}