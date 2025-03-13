class WindingController {
  private inputElements: {
    wireDiameterInput: HTMLInputElement;
    coilWidthInput: HTMLInputElement;
    layerCountInput: HTMLInputElement;
    windingThicknessInput: HTMLInputElement;
    confirmButton: HTMLButtonElement;
    startWindingButton: HTMLButtonElement;
    progressBar: HTMLElement;
  };

  constructor() {
    // Initialize elements using an object

    this.inputElements = {
      wireDiameterInput: document.getElementById(
        "wireDiameter"
      ) as HTMLInputElement,
      coilWidthInput: document.getElementById("coilWidth") as HTMLInputElement,
      layerCountInput: document.getElementById(
        "layerCount"
      ) as HTMLInputElement,
      windingThicknessInput: document.getElementById(
        "windingThickness"
      ) as HTMLInputElement,
      confirmButton: document.getElementById(
        "confirmButton"
      ) as HTMLButtonElement,
      startWindingButton: document.getElementById(
        "startWindingButton"
      ) as HTMLButtonElement,
      progressBar: document.getElementById("progressBar") as HTMLElement,
    };

    this.initializeEvents();
  }

  // Initialize event listeners
  private initializeEvents(): void {
    // Start button should be disabled in the beginning
    this.inputElements.startWindingButton.disabled = true;

    this.inputElements.confirmButton.addEventListener("click", () =>
      this.onConfirmButton()
    );
    this.inputElements.startWindingButton.addEventListener("click", () =>
      this.startWinding()
    );
  }

  // Validate inputs
  private validateElementInputs(
    wireDiameterInput: HTMLInputElement,
    coilWidthInput: HTMLInputElement,
    layerCountInput: HTMLInputElement
  ): boolean {
    if (
      !wireDiameterInput.value ||
      !coilWidthInput.value ||
      !layerCountInput.value
    ) {
      alert("لطفاً همه مقادیر را وارد کنید.");
      return false;
    } else {
      if (
        parseFloat(wireDiameterInput.value) <= 0 ||
        parseInt(layerCountInput.value) <= 0
      ) {
        alert("مقادیر وارد شده باید بزرگتر از صفر باشند.");
        return false;
      }
    }

    this.inputElements.startWindingButton.disabled = false;
    return true;
  }

  // Calculate winding thickness
  private calculateWireThickness(diameter: number, layers: number): string {
    if (!diameter || !layers) {
      return "نامشخص";
    }

    return `${(diameter * layers).toFixed(2)} mm`;
  }

  // Get all input values as an object
  public getInputValues() {
    const {
      wireDiameterInput,
      coilWidthInput,
      layerCountInput,
      windingThicknessInput,
    } = this.inputElements;

    return {
      wireDiameter: parseFloat(wireDiameterInput.value),
      coilWidth: parseInt(coilWidthInput.value),
      layerCount: parseInt(layerCountInput.value),
      windingThickness: parseFloat(windingThicknessInput.value.split(" ")[0]), // Clear measure unit
    };
  }

  // Handle confirm button logic
  private onConfirmButton(): void {
    const { wireDiameterInput, coilWidthInput, layerCountInput } =
      this.inputElements;

    if (
      !this.validateElementInputs(
        wireDiameterInput,
        coilWidthInput,
        layerCountInput
      )
    ) {
      alert("Error");
    }

    const diameter = parseFloat(this.inputElements.wireDiameterInput.value);
    const layers = parseInt(this.inputElements.layerCountInput.value);

    const thickness = this.calculateWireThickness(diameter, layers);
    this.inputElements.windingThicknessInput.value = thickness;

    alert(`ضخامت سیم‌پیچی: ${thickness}`);
  }

  // Simulate progress bar
  private simulateProgress(progress: number, timeOut: number): void {
    const interval = setInterval(() => {
      progress += 10;
      this.inputElements.progressBar.style.width = progress + "%";

      if (progress >= 100) {
        clearInterval(interval);
        alert("سیم‌پیچی کامل شد!");
      }
    }, timeOut);
  }

  // Start the winding process
  private startWinding(): void {
    console.log(this.getInputValues());
    this.inputElements.progressBar.style.width = "0%"; // Reset progress bar
    this.simulateProgress(0, 500); // Start simulation
  }
}

// Initialize the controller when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new WindingController();
});
