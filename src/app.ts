class WindingController {
  private inputElements: {
    wireDiameterInput: HTMLInputElement;
    coilWidthInput: HTMLInputElement;
    layerCountInput: HTMLInputElement;
    windingThicknessInput: HTMLInputElement;
    confirmButton: HTMLButtonElement;
    homingButton: HTMLButtonElement;
    startWindingButton: HTMLButtonElement;
    restartButton: HTMLButtonElement;
    progressBar: HTMLElement;
    statusMessage: HTMLElement;
  };

  constructor() {
    // Initialize elements

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

      homingButton: document.getElementById(
        "homingButton"
      ) as HTMLButtonElement,

      startWindingButton: document.getElementById(
        "startWindingButton"
      ) as HTMLButtonElement,

      restartButton: document.getElementById(
        "restartButton"
      ) as HTMLButtonElement,

      progressBar: document.getElementById("progressBar") as HTMLElement,

      statusMessage: document.getElementById("statusMessage") as HTMLElement,
    };

    this.initializeEvents();
  }

  // Initialize event listeners
  private initializeEvents(): void {
    // Start button should be disabled in the beginning
    // this.inputElements.startWindingButton.disabled = true;
    // this.inputElements.confirmButton.disabled = true;
    // this.inputElements.homingButton.disabled = false;

    this.inputElements.homingButton.addEventListener("click", () =>
      this.connectToDevice()
    );

    this.inputElements.confirmButton.addEventListener("click", () =>
      this.onConfirmButton()
    );

    this.inputElements.startWindingButton.addEventListener("click", () =>
      this.onStartWinding()
    );

    this.inputElements.restartButton.addEventListener("click", () =>
      this.refreshPage()
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

    // alert(`ضخامت سیم‌پیچی: ${thickness}`);
  }

  // Simulate progress bar
  private simulateProgress(progress: number, totalTime: number): void {
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
        this.inputElements.progressBar.style.width = "0%"; // Reset progress bar
      }
    }, timeOut);
  }

  // Start the winding process
  private onStartWinding(): void {
    console.log(this.getInputValues());
    this.sendDataToServer(this.getInputValues());
    this.inputElements.progressBar.style.width = "0%"; // Reset progress bar
    this.simulateProgress(0, 6000); // Start simulation
  }

  // Method to stop blinking and turn text green and bold
  public updateStatusToConnected(): void {
    this.inputElements.statusMessage.classList.remove("blinking"); // Stop blinking
    this.inputElements.statusMessage.classList.add("status-connected"); // Add green and bold styling
    this.inputElements.statusMessage.textContent = "دستگاه سیم‌پیچی متصل شد"; // Update the message
  }

  public connectToDevice(): void {
    console.log(`trying to connect...`);
    this.sendDataToServer({ connect: "trying..." });
    // Example: Call the method after 3 seconds (simulate connection)
    setTimeout(() => {
      this.updateStatusToConnected();
      this.inputElements.confirmButton.disabled = false;
    }, 5000);
  }

  // Method to refresh the page
  private refreshPage(): void {
    location.reload();
  }

  // Send data to the ESP32 server
  public sendDataToServer(data: Object) {
    fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((result) => {
        console.log("Server Response:", result);
        // alert("Data sent to ESP32 successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// Initialize the controller when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new WindingController();
});
