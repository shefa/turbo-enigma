# USAGE
# python fft.py --image images/neg_28.png

# import the necessary packages
import numpy as np
import argparse
import cv2

# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True,
	help="path to input image file")
args = vars(ap.parse_args())

# load the image from disk
image = cv2.imread(args["image"],0)

rows,cols = image.shape
radius=np.sqrt((rows*rows/2+cols*cols/2))
#prop=cv2.WARP_INVERSE_MAP
prop=cv2.WARP_FILL_OUTLIERS
center = (cols/2, rows/2)
img3=cv2.linearPolar(abs(image), center ,radius,prop)

cv2.imwrite("polar_" + args["image"], img3)
