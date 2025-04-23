import { Point } from "../type/common.types.js";
import { GraphType } from "../type/graph.types.js";
import { getVertexFromPoint } from "../utils/calculate.utils.js";

function obstacleToVertex(G: GraphType, newWeight: number, u: number, cell: HTMLSpanElement): void {
    G.updateEdgesFromNode(u);
    G.updateEdgesToNode(u);
    cell.innerText = `${newWeight}`;
    cell.classList.remove("obstacle");
}

function vertexToObstacle(G: GraphType, u: number, cell: HTMLSpanElement): void {
    G.removeEdgesOfNode(u);
    cell.innerText = "";
    cell.classList.add("obstacle");
}

export function updateWeight(globalPoint: Point, G: GraphType, Pannel: any) {
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
                obstacleToVertex(G, newWeight, u, cell);
            } else {
                // Đều là chướng ngại vật
                // Chỉ cần cập nhật trong ma trận tọng số là đủ
            }
        } else {
            // currentWeight khác 0 thì newWeight = 0
            if (currentWeight > 0) {
                // Đỉnh => Chướng ngại vật
                vertexToObstacle(G, u, cell);
            } else {
                // Đều là chướng ngại vật
                // Chỉ cần cập nhật trong ma trận tọng số là đủ
            }
        }
    } else {
        // Cả 2 đều trái dấu => trái tính chất
        if (currentWeight < 0) {
            // Chướng ngại vật => Đỉnh
            obstacleToVertex(G, newWeight, u, cell);
        } else {
            // Đỉnh => Chướng ngại vật
            vertexToObstacle(G, u, cell);
        }
    }
    // Cập nhật lại title cho cell
    if (newWeight > 0)
        cell.title = `Đỉnh ${u} có trọng số là ${newWeight}`;
    else
        cell.title = `Chướng ngại vật ${u} có trọng số là ${newWeight}`;
}