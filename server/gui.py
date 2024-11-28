import os
import subprocess
import socket
import threading
import qrcode
from tkinter import Tk, Label, PhotoImage
from PIL import Image, ImageTk

# Function to start the Flask backend with required arguments
# Function to start the Flask backend with required arguments
def start_backend():
    backend_command = [
        "C:/Users/Lenovo/Desktop/Minor Project/main/server/venv/Scripts/python.exe",
        "src/main.py",
        "--basnet_service_ip", "http://u2net-predictor.tenant-compass.global.coreweave.com/"
    ]

    process = subprocess.Popen(
        backend_command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,  # Decode output to strings instead of bytes
        bufsize=1   # Line-buffered output
    )

    # Display logs in real-time
    def stream_output(stream, prefix):
        for line in iter(stream.readline, ""):
            print(f"{prefix}{line}", end="")  # Prefix to differentiate stdout/stderr

    threading.Thread(target=stream_output, args=(process.stdout, "[INFO] "), daemon=True).start()
    threading.Thread(target=stream_output, args=(process.stderr, "[ERROR] "), daemon=True).start()


# Function to get local IP address
def get_local_ip():
    hostname = socket.gethostname()
    return socket.gethostbyname(hostname)

# Function to generate and display the QR code
def generate_qr(port=8080):
    ip = get_local_ip()
    url = f"http://{ip}:{port}"
    qr = qrcode.make(url)
    qr.save("qrcode.png")
    return url

# Tkinter GUI Setup
def create_gui(qr_url):
    root = Tk()
    root.title("AR Copy Paste")
    root.geometry("400x400")

    # Show the QR Code
    Label(root, text="Scan the QR code to connect your mobile app:", font=("Arial", 14)).pack(pady=10)

    img = Image.open("qrcode.png")
    img = img.resize((200, 200))
    qr_img = ImageTk.PhotoImage(img)
    qr_label = Label(root, image=qr_img)
    qr_label.image = qr_img
    qr_label.pack(pady=10)

    # Show the URL below the QR code
    Label(root, text=f"URL: {qr_url}", font=("Arial", 10), fg="blue").pack(pady=10)

    # Success Message Placeholder
    success_label = Label(root, text="", font=("Arial", 14), fg="green")
    success_label.pack(pady=20)

    # Start a thread to listen for the "/ping" endpoint
    def listen_for_ping():
        import requests
        while True:
            try:
                response = requests.get(f"{qr_url}/ping")
                if response.status_code == 200:
                    success_label.config(text="You can now use AR-copy-paste!")
                    break
            except:
                pass

    threading.Thread(target=listen_for_ping, daemon=True).start()

    root.mainloop()

# Main Entry Point
if __name__ == "__main__":
    # Start the backend in a separate thread
    threading.Thread(target=start_backend, daemon=True).start()

    # Generate QR Code
    url = generate_qr()

    # Launch GUI
    create_gui(url)
