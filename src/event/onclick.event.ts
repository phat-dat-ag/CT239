import { Point, UpdateSelectedCellUI } from "../type/common.types.js";
import { GraphType } from "../type/graph.types.js";
import { turnOnDiv } from "../utils/ui.utils.js";
import { getVertexFromPoint } from "../utils/calculate.utils.js";

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