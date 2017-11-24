import numpy as np
import argparse
import cv2
from skimage.filters import threshold_adaptive

def resize(image, width = None, height = None, inter = cv2.INTER_AREA):
    dim = None
    (h, w) = image.shape[:2]
    if width is None:
        r = height / float(h)
        dim = (int(w * r), height)
    else:
        r = width / float(w)
        dim = (width, int(h * r))
    return cv2.resize(image, dim, interpolation = inter)
	
def order_points(pts):
    rect = np.zeros((4, 2), dtype = "float32")
    s = pts.sum(axis = 1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    diff = np.diff(pts, axis = 1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect

def four_point_transform(image, pts):
    rect = order_points(pts)
    (tl, tr, br, bl) = rect
    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))
    
    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))
    
    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype = "float32")
    
    M = cv2.getPerspectiveTransform(rect, dst)
    return cv2.warpPerspective(image, M, (maxWidth, maxHeight))
    
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required = True,
	help = "Path to the image to be scanned")
args = vars(ap.parse_args())

image = cv2.imread(args["image"])
ratio = image.shape[0] / 700.0
orig = image.copy()
image = resize(image, height = 700)


gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
gray = cv2.GaussianBlur(gray, (5, 5), 0)
#gray = cv2.medianBlur(gray,5)
edged = cv2.Canny(gray, 10, 110)
edged_blur = edged.copy()
edged_blur = cv2.GaussianBlur(edged_blur, (3,3), 0)

cnts = cv2.findContours(edged_blur.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)[1]
print len(cnts)
cnts = sorted(cnts, key = cv2.contourArea, reverse = True)

found=0
for c in cnts:
    # approximate the contour
    peri = cv2.arcLength(c, True)
    approx = cv2.approxPolyDP(c, 0.02 * peri, True)
    
    # if our approximated contour has four points, then we
    # can assume that we have found our screen
    if len(approx) == 4:
        if found==0:
            screenCnt = approx
            found=1
        cv2.drawContours(image, [approx], -1, (0, 255, 0), 2)


warped = four_point_transform(orig, screenCnt.reshape(4, 2) * ratio)

# convert the warped image to grayscale, then threshold it
final = warped.copy()
final = cv2.cvtColor(final, cv2.COLOR_BGR2GRAY)
final = threshold_adaptive(final, 251, offset = 10)
final = final.astype("uint8") * 255


#cv2.imwrite("split_edged_"+args["image"],edged)
cv2.imwrite("split_edged_blurred_"+args["image"],edged_blur)
cv2.imwrite("split_contours_"+args["image"],image)
cv2.imwrite("split_final_"+args["image"],warped)
cv2.imwrite("split_final_thresh_"+args["image"],final)
