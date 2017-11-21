import cv2
import numpy as np

def rotate( img, angle ):
    row = img.shape[0]
    col = img.shape[1]
    center = tuple(np.array([row,col])/2)
    rot_mat = cv2.getRotationMatrix2D(center,angle,1.0)
    return cv2.warpAffine(img, rot_mat, (col,row), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

def rotate_bound(image, angle):
    (h, w) = image.shape[:2]
    (cX, cY) = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D((cX, cY), angle, 1.0)
    cos = np.abs(M[0, 0])
    sin = np.abs(M[0, 1])
    nW = int((h * sin) + (w * cos))
    nH = int((h * cos) + (w * sin))
    M[0, 2] += (nW / 2) - cX
    M[1, 2] += (nH / 2) - cY
    return cv2.warpAffine(image, M, (nW, nH), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

img = cv2.imread("in.png")
jimg = cv2.imread("orig-m20.jpg")

for angle in [1,5,10,20,50,70,80,85,89]:
    img2=rotate_bound(img,-angle-1)
    cv2.imwrite("y"+str(angle)+".png",img2)
    img3=rotate_bound(img,angle-1)
    cv2.imwrite("x"+str(angle)+".png",img3)
    img4=rotate_bound(jimg,angle)
    cv2.imwrite("p"+str(angle)+".jpg",img4)
    img5=rotate_bound(jimg,-angle)
    cv2.imwrite("q"+str(angle)+".jpg",img5)

