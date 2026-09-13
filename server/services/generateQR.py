import qrcode
link = "https://medikiosk.vercel.app/submit"
qr = qrcode.make(link)
qr.save("qr_code.png")
print("QR Code generated successfully!")