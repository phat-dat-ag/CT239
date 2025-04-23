import { Option } from "../type/common.types.js";

// Hỗ trợ click chọn 1 ô
// Bật màu cho ô
export function turnOnSelectedCell(selectedCell: HTMLSpanElement) {
    selectedCell.classList.add("selected-cell");
}
// Tắt màu cho ô
export function turnOffSelectedCell(selectedCell: HTMLSpanElement) {
    selectedCell.classList.remove("selected-cell");
}

// Hiển thị thẻ div đã bị ẩn lên
export function turnOnDiv(divs: Array<HTMLDivElement>) {
    for (let div of divs) {
        div.classList.add("turn-on");
        div.classList.remove("hide-div");
    }
}
// Ẩn thẻ div đang được hiển thị
export function turnOffDiv(divs: Array<HTMLDivElement>) {
    for (let div of divs) {
        div.classList.remove("turn-on");
        div.classList.add("hide-div");
    }
}

// Bật tắt vùng nhập đỉnh cuối khi chọn các thuật toán
// Hiển thị vùng nhập liệu
export function turnOnInputDiv(MenuConfig: any) {
    MenuConfig.speedGroup.classList.add("field-group");
    MenuConfig.speedGroup.classList.remove("hide-div");
    MenuConfig.endGroup.classList.add("field-group");
    MenuConfig.endGroup.classList.remove("hide-div");
}

// Ẩn vùng nhập liệu
export function turnOffInputDiv(MenuConfig: any) {
    MenuConfig.speedGroup.classList.remove("field-group");
    MenuConfig.speedGroup.classList.add("hide-div");
    MenuConfig.endGroup.classList.remove("field-group");
    MenuConfig.endGroup.classList.add("hide-div");
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Tạo các thẻ Select và Option
export function createSelectTag(options: Array<Option>, selectTag: HTMLSelectElement) {
    for (let option of options) {
        const optionTag: HTMLOptionElement = document.createElement("option") as HTMLOptionElement;
        optionTag.value = `${option.value}`;
        optionTag.innerText = option.title;
        selectTag.appendChild(optionTag);
    }
}