#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

// Replace with your network credentials
const char *ssid = "YOUR_SSID";
const char *password = "YOUR_PASSWORD";

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

// Function to handle JSON data
void handleJsonRequest(AsyncWebServerRequest *request, uint8_t *data, size_t len)
{
    // Allocate a temporary JsonDocument
    StaticJsonDocument<256> doc;

    // Deserialize the JSON data
    DeserializationError error = deserializeJson(doc, data, len);

    if (error)
    {
        Serial.print("JSON Parsing Failed: ");
        Serial.println(error.c_str());
        request->send(400, "application/json", "{\"message\":\"Invalid JSON\"}");
        return;
    }

    // Extract values from the JSON object
    float wireDiameter = doc["wireDiameter"];
    int coilWidth = doc["coilWidth"];
    int layerCount = doc["layerCount"];
    const char *windingThickness = doc["windingThickness"];

    // Debugging: Print the received data
    Serial.println("Received JSON:");
    Serial.print("Wire Diameter: ");
    Serial.println(wireDiameter);
    Serial.print("Coil Width: ");
    Serial.println(coilWidth);
    Serial.print("Layer Count: ");
    Serial.println(layerCount);
    Serial.print("Winding Thickness: ");
    Serial.println(windingThickness);

    // Send a success response
    request->send(200, "application/json", "{\"message\":\"Data received successfully\"}");
}

void setup()
{
    // Start Serial communication
    Serial.begin(115200);

    // Connect to Wi-Fi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");

    // Define route to handle POST request
    server.on("/submit", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL, handleJsonRequest);

    // Start the server
    server.begin();
    Serial.println("Server started");
}

void loop()
{
    // Nothing needed here for Async server
}
