import qrcode
link = "http://localhost:5173/submit"
qr = qrcode.make(link)
qr.save("qr_code.png")
print("QR Code generated successfully!")