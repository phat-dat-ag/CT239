import Graph from "./Graph.js";
import { drawGraph } from "./draw.js";
let G = new Graph();
let globalPoint = { i: 0, j: 0 };
const container = document.getElementById("container");
const pannel = document.getElementById("pannel");
const inforCell = document.getElementById("infor-cell");
const weightInput = document.getElementById("weight-input");
const updateWeightButton = document.getElementById("updat-weight-button");
const button = document.getElementById("random");
function randomFromZeroTo(number) {
    if (number <= 0)
        return 0;
    return Math.round(Math.random() * number);
}
;
function getVertexFromPoint(point, n) {
    return point.i * n + (point.j + 1);
}
function checkInput(matrix) {
    const columnAmount = matrix[0].length;
    for (let i = 0; i < matrix.length; i++)
        if (matrix[i].length !== columnAmount)
            return false;
    return true;
}
// Sự kiện click chọn 1 ô
function handleClickCell(e) {
    pannel.classList.add("turn-on");
    inforCell.replaceChildren();
    const target = e.target;
    const cell = document.getElementById(target.id);
    // Lấy tọa độ từ id đã đặt trước đó
    let [i, j] = cell.id.split("_");
    globalPoint = {
        i: parseInt(i),
        j: parseInt(j)
    };
    weightInput.value = `${G.getWeightAtCell(globalPoint)}`;
    const n = G.getColumnCount();
    const vertex = getVertexFromPoint(globalPoint, n);
    inforCell.innerText = `Ô ${vertex}, Tọa độ: (${globalPoint.i}, ${globalPoint.j})`;
}
// Random ra ma trận
button.onclick = function () {
    // Tắt pannel mỗi khi random lại
    pannel.classList.remove("turn-on");
    const rowCount = randomFromZeroTo(3) + 5;
    const columnCount = randomFromZeroTo(3) + 5;
    let matrix = [];
    for (let i = 0; i < rowCount; i++) {
        let row = [];
        for (let j = 0; j < columnCount; j++) {
            // Random dấu trước: xác suất 30% dấu âm
            const sign = (randomFromZeroTo(10) <= 3) ? -1 : 1;
            // Phạm vi -99<=...<=99
            row.push(sign * randomFromZeroTo(99));
        }
        matrix.push(row);
    }
    if (checkInput(matrix)) {
        // Class Graph chính thức được tạo
        G.buildGraph(matrix);
        const m = G.getRowCount();
        const n = G.getColumnCount();
        const weightMatrix = G.getWeightMatrix();
        drawGraph(container, m, n, weightMatrix, handleClickCell);
    }
    else {
        confirm("Ma trận không hợp lệ");
    }
};
// Cập nhật trọng số
updateWeightButton.onclick = function (e) {
    const selectedCellID = `${globalPoint.i}_${globalPoint.j}`;
    const cell = document.getElementById(selectedCellID);
    // Trọng số hiện tại
    const currentWeight = G.getWeightAtCell(globalPoint);
    // Trọng số mới
    const newWeight = parseInt(weightInput.value);
    // typeof NaN là number nên không thể kiểm tra typeof
    if (isNaN(newWeight)) {
        confirm("Trọng số không hợp lệ");
        return;
    }
    // Khi cả 2 bằng nhau => Bỏ qua
    if (currentWeight === newWeight) {
        return;
    }
    const n = G.getColumnCount();
    const u = getVertexFromPoint(globalPoint, n);
    // Cập nhật ma trận trọng số
    G.setWeightMatrixAt(globalPoint, newWeight);
    function obstacleToVertex(u, cell) {
        G.updateEdgesFromNode(u);
        G.updateEdgesToNode(u);
        cell.innerText = `${newWeight}`;
        cell.classList.remove("obstacle");
    }
    function vertexToObstacle(u, cell) {
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
        }
        else if (currentWeight < 0) {
            // Đều là chướng ngại vật
            // Chỉ cần cập nhật trong ma trận tọng số là đủ
        }
    }
    else if (currentWeight * newWeight === 0) {
        // Cả 2 KHÔNG đồng thời bằng 0
        if (currentWeight === 0) {
            // currentWeight = 0 thì newWeight khác 0
            if (newWeight > 0) {
                // Chướng ngại vật => Đỉnh
                obstacleToVertex(u, cell);
            }
            else {
                // Đều là chướng ngại vật
                // Chỉ cần cập nhật trong ma trận tọng số là đủ
            }
        }
        else {
            // currentWeight khác 0 thì newWeight = 0
            if (currentWeight > 0) {
                // Đỉnh => Chướng ngại vật
                vertexToObstacle(u, cell);
            }
            else {
                // Đều là chướng ngại vật
                // Chỉ cần cập nhật trong ma trận tọng số là đủ
            }
        }
    }
    else {
        // Cả 2 đều trái dấu => trái tính chất
        if (currentWeight < 0) {
            // Chướng ngại vật => Đỉnh
            obstacleToVertex(u, cell);
        }
        else {
            // Đỉnh => Chướng ngại vật
            vertexToObstacle(u, cell);
        }
    }
};
