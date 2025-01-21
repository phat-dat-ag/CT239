import Graph from "./Graph.js";
import { drawGraph } from "./draw.js";

interface Point {
    i: number;
    j: number;
}

interface Option {
    methodID?: string;
    algorithmID?: string;
    speed?: number;
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
const pannel: HTMLDivElement = document.getElementById("pannel") as HTMLDivElement;
const inforCell: HTMLParagraphElement = document.getElementById("infor-cell") as HTMLParagraphElement;
const weightInput: HTMLInputElement = document.getElementById("weight-input") as HTMLInputElement;
const updateWeightButton: HTMLButtonElement = document.getElementById("updat-weight-button") as HTMLButtonElement;
const exitButton: HTMLButtonElement = document.getElementById("exit-button") as HTMLButtonElement;
// Menu tùy chỉnh
const menu: HTMLDivElement = document.getElementById("menu") as HTMLDivElement;
const speedSelectTag: HTMLSelectElement = document.getElementById("speed-select") as HTMLSelectElement;
const algorithmTag: HTMLSelectElement = document.getElementById("algorithm-select") as HTMLSelectElement;
const startVertexInput: HTMLInputElement = document.getElementById("start-vertex-input") as HTMLInputElement;
const endVertexInput: HTMLInputElement = document.getElementById("end-vertex-input") as HTMLInputElement;
const endVertexInputDiv: HTMLDivElement = document.getElementById("end-vertex-input-div") as HTMLDivElement;
const algorithmRunButton: HTMLButtonElement = document.getElementById("algorithm-run") as HTMLButtonElement;

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

// Dùng trong createMatrixButton: Hàm sự kiện click chọn 1 ô
function handleClickCell(e: Event): void {
    pannel.classList.add("turn-on");
    inforCell.replaceChildren();

    const target = e.target as HTMLSpanElement;
    const cell: HTMLSpanElement = document.getElementById(target.id) as HTMLSpanElement;
    // Lấy tọa độ từ id đã đặt trước đó
    let [i, j]: Array<string> = cell.id.split("_");
    globalPoint = {
        i: parseInt(i),
        j: parseInt(j)
    }

    weightInput.value = `${G.getWeightAtCell(globalPoint)}`;
    const n: number = G.getColumnCount();
    const vertex: number = getVertexFromPoint(globalPoint, n);
    inforCell.innerText = `Ô ${vertex}, Tọa độ: (${globalPoint.i}, ${globalPoint.j})`;
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
    pannel.classList.remove("turn-on");
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
    } else {
        confirm("Ma trận không hợp lệ");
    }
}

// USE CASE 2: TÙY CHỌN TỐC ĐỘ MINH HỌA GIẢI THUẬT
var ms: number = 2000;

const speedOptions: Array<Option> = [
    { speed: 2000, title: "Rất chậm" },
    { speed: 1000, title: "Chậm" },
    { speed: 500, title: "Bình thường" },
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

// USE CASE 3: TÙY CHỌN GIẢI THUẬT
var algorithmID: number = 1;

const algorithmOptions: Array<Option> = [
    { algorithmID: "1", title: "Moore Dijkstra" },
    { algorithmID: "2", title: "Duyệt BFS" },
    { algorithmID: "3", title: "Duyệt DFS" },
]
for (let option of algorithmOptions) {
    const op: HTMLOptionElement = document.createElement("option");
    op.value = `${option.algorithmID}`;
    op.innerText = option.title;
    algorithmTag.appendChild(op);
}
algorithmTag.onchange = (e: Event): void => {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    // Gán lên global
    algorithmID = parseInt(target.value);

    if (algorithmID === 1) {
        endVertexInputDiv.classList.remove("hide-div");
        endVertexInputDiv.classList.add("field-group");
    } else if (algorithmID === 2 || algorithmID === 3) {
        endVertexInputDiv.classList.remove("field-group");
        endVertexInputDiv.classList.add("hide-div");
    }
}

var s: number | null = null, t: number | null = null;
// Thực thi giải thuật được chọn
algorithmRunButton.onclick = (e: Event): void => {
    if (isNaN(parseInt(startVertexInput.value))) {
        confirm("Đỉnh bắt đầu không hợp lệ!");
        return;
    } else s = parseInt(startVertexInput.value);

    if (algorithmID === 1) {
        if (isNaN(parseInt(endVertexInput.value))) {
            confirm("Đỉnh kết thúc không hợp lệ!");
            return;
        } else t = parseInt(endVertexInput.value);
        G.Dijkstra(s, t, ms);
    } else if (algorithmID === 2) {
        console.log("BFS với đỉnh: ", s);
    } else if (algorithmID === 3) {
        console.log("DFS với đỉnh: ", s);
    }
}

// USE CASE 4: CẬP NHẬT TRỌNG SỐ TRÊN GIAO DIỆN
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
}

// USE CASE 5: ĐÓNG GIAO DIỆN CẬP NHẬT TRỌNG SỐ
exitButton.onclick = (e: Event): void => {
    pannel.classList.remove("turn-on");
}