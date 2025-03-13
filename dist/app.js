class WindingController {
    constructor() {
        // Initialize elements using an object
        const elementId = [
            "wireDiameter",
            "coilWidth",
            "layerCount",
            "windingThickness",
            "confirmButton",
            "startWindingButton",
            "progressBar",
        ];
        this.inputElements = {
            wireDiameterInput: document.getElementById("wireDiameter"),
            coilWidthInput: document.getElementById("coilWidth"),
            layerCountInput: document.getElementById("layerCount"),
            windingThicknessInput: document.getElementById("windingThickness"),
            confirmButton: document.getElementById("confirmButton"),
            startWindingButton: document.getElementById("startWindingButton"),
            progressBar: document.getElementById("progressBar"),
        };
        this.inputElements.startWindingButton.disabled = true;
        this.initializeEvents();
    }
    // Initialize event listeners
    initializeEvents() {
        this.inputElements.confirmButton.addEventListener("click", () => this.onConfirmButton());
        this.inputElements.startWindingButton.addEventListener("click", () => this.startWinding());
    }
    // Validate inputs
    validateElementInputs() {
        const { wireDiameterInput, coilWidthInput, layerCountInput } = this.inputElements;
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
    calculateWireThickness() {
        const diameter = parseFloat(this.inputElements.wireDiameterInput.value);
        const layers = parseInt(this.inputElements.layerCountInput.value);
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
        if (!this.validateElementInputs()) {
            alert("Error");
        }
        const thickness = this.calculateWireThickness();
        this.inputElements.windingThicknessInput.value = thickness;
        alert(`ضخامت سیم‌پیچی: ${thickness}`);
    }
    // Simulate progress bar
    simulateProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            this.inputElements.progressBar.style.width = progress + "%";
            if (progress >= 100) {
                clearInterval(interval);
                alert("سیم‌پیچی کامل شد!");
            }
        }, 500);
    }
    // Start the winding process
    startWinding() {
        console.log(this.getInputValues());
        this.inputElements.progressBar.style.width = "0%"; // Reset progress bar
        this.simulateProgress(); // Start simulation
    }
}
// Initialize the controller when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new WindingController();
});
