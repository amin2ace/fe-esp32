const button = document.getElementById("toggle-btn");
button === null || button === void 0 ? void 0 : button.addEventListener("click", () => {
    fetch("/toggle", { method: "POST" })
        .then((response) => response.text())
        .then((data) => alert(data))
        .catch((error) => console.error("Error:", error));
});
