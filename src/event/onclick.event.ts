import { Point, UpdateSelectedCellUI, HandleClickCell } from "../type/common.types.js";
import { GraphType } from "../type/graph.types.js";
import { turnOnDiv, turnOffDiv, turnOnInputDiv, turnOffInputDiv } from "../utils/ui.utils.js";
import { getVertexFromPoint } from "../utils/calculate.utils.js";
import { viewModeSelection, algorithmSelection } from "../constant/common.constant.js";
import { drawGraph } from "../draw/draw.js";
import { drawVisGraph } from "../vis/visGraph.js";

// Xử lý khi chọn 1 ô
export function handleClickOneCell(e: Event, G: GraphType, Pannel: any, updateSelectedCellUI: UpdateSelectedCellUI) {
    turnOnDiv([Pannel.container]);
    Pannel.inforCell.replaceChildren();

    const target = e.target as HTMLSpanElement;
    const cell: HTMLSpanElement = document.getElementById(target.id) as HTMLSpanElement;

    // Lấy tọa độ từ id đã đặt trước đó
    let [i, j]: Array<string> = cell.id.split("_");
    const point: Point = {
        i: parseInt(i),
        j: parseInt(j)
    }

    Pannel.weightInput.value = `${G.getWeightAtCell(point)}`;
    const n: number = G.getColumnCount();
    const vertex: number = getVertexFromPoint(point, n);
    Pannel.inforCell.innerHTML = `Ô <b style="color:red">${vertex}</b>, Tọa độ: (${point.i}, ${point.j})`;

    updateSelectedCellUI(cell, vertex, point);
}

// Xử lý khi chọn chế độ hiển thị ma trận
export function handleClickViewModeButton(G: GraphType, selectedViewMode: number, MenuConfig: any, Algorithm: any, Pannel: any, handleClickCell: HandleClickCell) {
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

// Tắt chọn Tốc độ/ Đỉnh kết thúc nếu đó khác thuật toán DIJKSTRA
export function handleClickAlgorithmButton(selectedAlgorithm: number, MenuConfig: any) {
    if (selectedAlgorithm === algorithmSelection.DIJKSTRA)
        turnOnInputDiv(MenuConfig);
    else
        turnOffInputDiv(MenuConfig);
} 