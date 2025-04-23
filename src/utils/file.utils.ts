// Hỗ trợ sinh ma trận: Hàm đọc file
export function readFileAsText(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject("Có lỗi khi đọc file");
        reader.readAsText(file);
    });
}