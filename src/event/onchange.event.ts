import { createFileGroup } from "../utils/ui.utils.js";

// Xử lý khi các option được thay đổi
export function handleOptionChange(e: Event): number {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    return parseInt(target.value);
}

// Xử lý khi thay đổi cách tạo ma trận
export function handleCreateMatrixMethodChange(e: Event, CreateMatrix: any, setFile: (f: File | null) => void): void {
    CreateMatrix.fileInput.replaceChildren();
    const target = e.target as HTMLSelectElement;
    const methodID = parseInt(target.value);
    if (methodID === 0) setFile(null);
    else {
        // Trong callback này lại có callback khác
        const fileGroup: HTMLDivElement = createFileGroup(setFile);
        CreateMatrix.fileInput.appendChild(fileGroup);
    }
}