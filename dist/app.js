class WindingController {
    constructor() {
        // Initialize elements using an object
        this.inputElements = {
            wireDiameterInput: document.getElementById("wireDiameter"),
            coilWidthInput: document.getElementById("coilWidth"),
            layerCountInput: document.getElementById("layerCount"),
            windingThicknessInput: document.getElementById("windingThickness"),
            confirmButton: document.getElementById("confirmButton"),
            startWindingButton: document.getElementById("startWindingButton"),
            progressBar: document.getElementById("progressBar"),
            restartButton: document.getElementById("restartButton"),
        };
        this.initializeEvents();
    }
    // Initialize event listeners
    initializeEvents() {
        // Start button should be disabled in the beginning
        this.inputElements.startWindingButton.disabled = true;
        this.inputElements.confirmButton.addEventListener("click", () => this.onConfirmButton());
        this.inputElements.startWindingButton.addEventListener("click", () => this.startWinding());
        this.inputElements.restartButton.addEventListener("click", () => this.startWinding());
    }
    // Validate inputs
    validateElementInputs(wireDiameterInput, coilWidthInput, layerCountInput) {
        if (!wireDiameterInput.value ||
            !coilWidthInput.value ||
            !layerCountInput.value) {
            alert("لطفاً همه مقادیر را وارد کنید.");
            return false;
        }
        else {
            if (parseFloat(wireDiameterInput.value) <= 0 ||
                parseInt(layerCountInput.value) <= 0) {
                alert("مقادیر وارد شده باید بزرگتر از صفر باشند.");
                return false;
            }
        }
        this.inputElements.startWindingButton.disabled = false;
        return true;
    }
    // Calculate winding thickness
    calculateWireThickness(diameter, layers) {
        if (!diameter || !layers) {
            return "نامشخص";
        }
        return `${(diameter * layers).toFixed(2)} mm`;
    }
    // Get all input values as an object
    getInputValues() {
        const { wireDiameterInput, coilWidthInput, layerCountInput, windingThicknessInput, } = this.inputElements;
        return {
            wireDiameter: parseFloat(wireDiameterInput.value),
            coilWidth: parseInt(coilWidthInput.value),
            layerCount: parseInt(layerCountInput.value),
            windingThickness: parseFloat(windingThicknessInput.value.split(" ")[0]), // Clear measure unit
        };
    }
    // Handle confirm button logic
    onConfirmButton() {
        const { wireDiameterInput, coilWidthInput, layerCountInput } = this.inputElements;
        if (!this.validateElementInputs(wireDiameterInput, coilWidthInput, layerCountInput)) {
            alert("Error");
        }
        const diameter = parseFloat(this.inputElements.wireDiameterInput.value);
        const layers = parseInt(this.inputElements.layerCountInput.value);
        const thickness = this.calculateWireThickness(diameter, layers);
        this.inputElements.windingThicknessInput.value = thickness;
        alert(`ضخامت سیم‌پیچی: ${thickness}`);
    }
    // Simulate progress bar
    simulateProgress(progress, totalTime) {
        this.inputElements.progressBar.style.width = "0%"; // Reset progress bar
        const timeOut = totalTime / 20;
        // This is controlling the fill speed of progress bar
        // Interval says 'do something and whait after every time done'
        const interval = setInterval(() => {
            progress += 5;
            this.inputElements.progressBar.style.width = progress + "%";
            // After progress bar filled
            if (progress > 100) {
                clearInterval(interval);
                alert("سیم‌پیچی کامل شد!");
                // Enable restart button
                this.inputElements.restartButton.disabled = false;
            }
        }, timeOut);
    }
    // Start the winding process
    startWinding() {
        console.log(this.getInputValues());
        this.simulateProgress(0, 6000); // Start simulation
    }
}
// Initialize the controller when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new WindingController();
});
