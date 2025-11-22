import cv2
import numpy as np
import time
from PIL import ImageFont, ImageDraw, Image

font_path = "C:/Windows/Fonts/malgun.ttf"
font = ImageFont.truetype(font_path, 50)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

cam = cv2.VideoCapture(0)
cam.set(3, 400)
cam.set(4, 350)

start_time = None
pass_time = None
required_time = 2
exit_after_pass = 3
passed = False  # 통과 여부

while True:
    ret, frame = cam.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if not passed:
        if len(faces) > 0:
            if start_time is None:
                start_time = time.time()
            elapsed_time = time.time() - start_time

            if elapsed_time >= required_time:
                status_text = " 통과"
                color = (0, 255, 0)
                passed = True
                pass_time = time.time()
            else:
                status_text = " 대기 중..."
                color = (0, 165, 255)
        else:
            start_time = None
            status_text = " 미통과"
            color = (255, 0, 0)
    else:
        status_text = " 통과"
        color = (0, 255, 0)

    frame_pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(frame_pil)
    draw.text((20, 20), status_text, font=font, fill=color)
    frame = cv2.cvtColor(np.array(frame_pil), cv2.COLOR_RGB2BGR)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)

    cv2.imshow('Face Detection', frame)

    # 통과 후 5초가 지나면 종료
    if passed and (time.time() - pass_time >= exit_after_pass):
        print("통과 후 1초 경과, 프로그램 종료.")
        break

    if cv2.waitKey(1) & 0xFF == ord('w'):
        break

cam.release()
cv2.destroyAllWindows()
