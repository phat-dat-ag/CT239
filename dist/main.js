var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Graph from "./Graph.js";
import { drawGraph } from "./draw.js";
var file = null;
var G = new Graph();
var globalPoint = { i: 0, j: 0 };
const container = document.getElementById("container");
// Bảng điều khiển
const methodSelect = document.getElementById("method-select");
const fileInputArea = document.getElementById("file-input-area");
const createMatrixButton = document.getElementById("create-matrix-button");
const pannel = document.getElementById("pannel");
const inforCell = document.getElementById("infor-cell");
const weightInput = document.getElementById("weight-input");
const updateWeightButton = document.getElementById("updat-weight-button");
const exitButton = document.getElementById("exit-button");
// Menu tùy chỉnh
const menu = document.getElementById("menu");
const speedSelectTag = document.getElementById("speed-select");
const algorithmTag = document.getElementById("algorithm-select");
const startVertexInput = document.getElementById("start-vertex-input");
const endVertexInput = document.getElementById("end-vertex-input");
const endVertexInputDiv = document.getElementById("end-vertex-input-div");
const algorithmRunButton = document.getElementById("algorithm-run");
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
// USE CASE 1: TÙY CHỌN CÁCH SINH RA MA TRẬN
const methodOptions = [
    { methodID: "0", title: "Ngẫu nhiên" },
    { methodID: "1", title: "Đọc file" },
];
for (let method of methodOptions) {
    const op = document.createElement("option");
    op.value = `${method.methodID}`;
    op.innerText = method.title;
    methodSelect.appendChild(op);
}
methodSelect.onchange = (e) => {
    fileInputArea.replaceChildren();
    const target = e.target;
    const methodID = parseInt(target.value);
    if (methodID === 0)
        file = null;
    else if (methodID === 1) {
        const input = document.createElement("input");
        input.id = "file-input";
        input.type = "file";
        input.accept = ".txt";
        const fileGroup = document.createElement("div");
        fileGroup.classList.add("field-group");
        fileGroup.appendChild(input);
        // Sự kiện thay đổi file
        input.onchange = (e) => {
            const target = e.target;
            if (target.files && target.files.length > 0)
                file = target.files[0];
        };
        fileInputArea.appendChild(fileGroup);
    }
};
// Dùng trong createMatrixButton: Hàm sự kiện click chọn 1 ô
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
// Dùng trong createMatrixButton: Hàm đọc file
function readFileAsText(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject("Có lỗi khi đọc file");
        reader.readAsText(file);
    });
}
// Sinh ra ma trận
createMatrixButton.onclick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Tắt pannel mỗi khi random lại
        pannel.classList.remove("turn-on");
        let matrix = [];
        if (file) {
            try {
                const content = yield readFileAsText(file);
                // Tách thành danh sách các dòng
                const rows = content.split("\n");
                let stringArray;
                for (let row of rows) {
                    let rowOfMatrix = [];
                    stringArray = row.split(" ");
                    for (let str of stringArray)
                        rowOfMatrix.push(parseInt(str));
                    matrix.push(rowOfMatrix);
                }
            }
            catch (err) {
                console.log("Lỗi đọc file: ", err);
            }
        }
        else {
            const rowCount = randomFromZeroTo(3) + 5;
            const columnCount = randomFromZeroTo(3) + 5;
            for (let i = 0; i < rowCount; i++) {
                let row = [];
                for (let j = 0; j < columnCount; j++) {
                    // Random dấu trước: xác suất 20% dấu âm
                    const sign = (randomFromZeroTo(10) <= 2) ? -1 : 1;
                    // Phạm vi -99<=...<=99
                    row.push(sign * randomFromZeroTo(99));
                }
                matrix.push(row);
            }
        }
        if (checkInput(matrix)) {
            // Class Graph chính thức được tạo
            G.buildGraph(matrix);
            const m = G.getRowCount();
            const n = G.getColumnCount();
            const weightMatrix = G.getWeightMatrix();
            drawGraph(container, m, n, weightMatrix, handleClickCell);
            // Đặt lại s và t
            s = 0;
            t = 0;
            // Đặt max và value cho start/ end vertex input
            startVertexInput.max = `${G.getNodeCount()}`;
            startVertexInput.value = `${s}`;
            endVertexInput.max = `${G.getNodeCount()}`;
            endVertexInput.value = `${t}`;
            // Bật Menu tùy chỉnh lên
            menu.classList.add("turn-on");
        }
        else {
            confirm("Ma trận không hợp lệ");
        }
    });
};
// USE CASE 2: TÙY CHỌN TỐC ĐỘ MINH HỌA GIẢI THUẬT
var ms = 2000;
const speedOptions = [
    { speed: 2000, title: "Rất chậm" },
    { speed: 1000, title: "Chậm" },
    { speed: 500, title: "Bình thường" },
    { speed: 100, title: "Nhanh" },
    { speed: 10, title: "Rất nhanh" }
];
for (let option of speedOptions) {
    const op = document.createElement("option");
    op.value = `${option.speed}`;
    op.innerText = option.title;
    speedSelectTag.appendChild(op);
}
speedSelectTag.onchange = (e) => {
    const target = e.target;
    ms = parseInt(target.value);
};
// USE CASE 3: TÙY CHỌN GIẢI THUẬT
var algorithmID = 1;
const algorithmOptions = [
    { algorithmID: "1", title: "Moore Dijkstra" },
    { algorithmID: "2", title: "Duyệt BFS" },
    { algorithmID: "3", title: "Duyệt DFS" },
];
for (let option of algorithmOptions) {
    const op = document.createElement("option");
    op.value = `${option.algorithmID}`;
    op.innerText = option.title;
    algorithmTag.appendChild(op);
}
algorithmTag.onchange = (e) => {
    const target = e.target;
    // Gán lên global
    algorithmID = parseInt(target.value);
    if (algorithmID === 1) {
        endVertexInputDiv.classList.remove("hide-div");
        endVertexInputDiv.classList.add("field-group");
    }
    else if (algorithmID === 2 || algorithmID === 3) {
        endVertexInputDiv.classList.remove("field-group");
        endVertexInputDiv.classList.add("hide-div");
    }
};
var s = null, t = null;
// Thực thi giải thuật được chọn
algorithmRunButton.onclick = (e) => {
    if (isNaN(parseInt(startVertexInput.value))) {
        confirm("Đỉnh bắt đầu không hợp lệ!");
        return;
    }
    else
        s = parseInt(startVertexInput.value);
    if (algorithmID === 1) {
        if (isNaN(parseInt(endVertexInput.value))) {
            confirm("Đỉnh kết thúc không hợp lệ!");
            return;
        }
        else
            t = parseInt(endVertexInput.value);
        G.Dijkstra(s, t, ms);
    }
    else if (algorithmID === 2) {
        console.log("BFS với đỉnh: ", s);
    }
    else if (algorithmID === 3) {
        console.log("DFS với đỉnh: ", s);
    }
};
// USE CASE 4: CẬP NHẬT TRỌNG SỐ TRÊN GIAO DIỆN
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
// USE CASE 5: ĐÓNG GIAO DIỆN CẬP NHẬT TRỌNG SỐ
exitButton.onclick = (e) => {
    pannel.classList.remove("turn-on");
};
