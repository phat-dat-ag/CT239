// Chứa ma trận
export const Container: HTMLDivElement = document.getElementById("container") as HTMLDivElement;

// Tạo ma trận
export const CreateMatrix = {
    selectTag: document.getElementById("method-select") as HTMLSelectElement,
    fileInput: document.getElementById("file-input-area") as HTMLDivElement,
    button: document.getElementById("create-matrix-button") as HTMLButtonElement
}

// Chế độ xem
export const ViewMode = {
    container: document.getElementById("view-mode") as HTMLDivElement,
    selectTag: document.getElementById("view-mode-select") as HTMLSelectElement,
    button: document.getElementById("select-view") as HTMLButtonElement
}

// Thuật toán
export const Algorithm = {
    container: document.getElementById("algorithm-option") as HTMLDivElement,
    selectTag: document.getElementById("algorithm-select") as HTMLSelectElement,
    button: document.getElementById("select-algorithm") as HTMLButtonElement
}

// Tùy chỉnh dữ liệu
export const Pannel = {
    container: document.getElementById("pannel") as HTMLDivElement,
    inforCell: document.getElementById("infor-cell") as HTMLParagraphElement,
    weightInput: document.getElementById("weight-input") as HTMLInputElement,
    updateButton: document.getElementById("update-weight-button") as HTMLButtonElement,
    exitButton: document.getElementById("exit-button") as HTMLButtonElement
}

// Menu tùy chỉnh
export const MenuConfig = {
    container: document.getElementById("menu") as HTMLDivElement,
    speedSelectTag: document.getElementById("speed-select") as HTMLSelectElement,
    startInput: document.getElementById("start-vertex-input") as HTMLInputElement,
    startClick: document.getElementById("start") as HTMLButtonElement,
    endInput: document.getElementById("end-vertex-input") as HTMLInputElement,
    endClick: document.getElementById("end") as HTMLButtonElement,
    // Hai nhóm dữ liệu cần ẩn/ tắt với từng loại thuật toán
    // Riêng nhập đỉnh bắt đầu là luôn cần có
    speedGroup: document.getElementById("speed-field-group") as HTMLDivElement,
    endGroup: document.getElementById("end-vertex-field-group") as HTMLDivElement,
    // Thực hiện thuật toán
    runButton: document.getElementById("algorithm-run") as HTMLButtonElement
}

// Các khối minh họa chi tiết Moore Dijkstra
export const block_1: HTMLDivElement = document.getElementById("block-1") as HTMLDivElement;
export const block_2: HTMLDivElement = document.getElementById("block-2") as HTMLDivElement;
export const block_3: HTMLDivElement = document.getElementById("block-3") as HTMLDivElement;
