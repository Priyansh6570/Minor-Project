import os
import subprocess
import socket
import threading
import qrcode
from tkinter import Tk, Label, PhotoImage
from PIL import Image, ImageTk

def start_backend():
    backend_command = [
        "Absolute path to python.exe from your virtual environment",
        "src/main.py",
        "--basnet_service_ip", "http://u2net-predictor.tenant-compass.global.coreweave.com/"
    ]

    process = subprocess.Popen(
        backend_command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1
    )

    def stream_output(stream, prefix):
        for line in iter(stream.readline, ""):
            print(f"{prefix}{line}", end="")

    threading.Thread(target=stream_output, args=(process.stdout, "[INFO] "), daemon=True).start()
    threading.Thread(target=stream_output, args=(process.stderr, "[ERROR] "), daemon=True).start()

def get_local_ip():
    hostname = socket.gethostname()
    return socket.gethostbyname(hostname)

def generate_qr(port=8080):
    ip = get_local_ip()
    url = f"http://{ip}:{port}"
    qr = qrcode.make(url)
    qr.save("qrcode.png")
    return url

def create_gui(qr_url):
    root = Tk()
    root.title("AR Copy Paste")
    root.geometry("400x400")

    Label(root, text="Scan the QR code to connect your mobile app:", font=("Arial", 14)).pack(pady=10)

    img = Image.open("qrcode.png")
    img = img.resize((200, 200))
    qr_img = ImageTk.PhotoImage(img)
    qr_label = Label(root, image=qr_img)
    qr_label.image = qr_img
    qr_label.pack(pady=10)

    Label(root, text=f"URL: {qr_url}", font=("Arial", 10), fg="blue").pack(pady=10)

    success_label = Label(root, text="", font=("Arial", 14), fg="green")
    success_label.pack(pady=20)

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

if __name__ == "__main__":
    threading.Thread(target=start_backend, daemon=True).start()
    url = generate_qr()
    create_gui(url)
