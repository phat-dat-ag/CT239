import { turnOnDiv, turnOffDiv } from "../utils/ui.utils.js";
import { readFileAsText } from "../utils/file.utils.js";
import { randomFromZeroTo, checkInput } from "../utils/calculate.utils.js";
import { drawGraph } from "../draw/draw.js";
import { GraphType } from "../type/graph.types.js";
import { HandleClickCell, SetSAndT } from "../type/common.types.js";
import { viewModeSelection } from "../constant/common.constant.js";

export async function createMatrixFunc(file: File | null, G: GraphType, s: number | null, t: number | null, Pannel: any, MenuConfig: any, ViewMode: any, Algorithm: any, handleClickCell: HandleClickCell, setSAndT: SetSAndT) {
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
        // Đặt lại s và t trên global
        setSAndT();
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