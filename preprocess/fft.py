# USAGE
# python fft.py --image images/neg_28.png

# import the necessary packages
#from __future__ import division
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
nrows = cv2.getOptimalDFTSize(rows)
ncols = cv2.getOptimalDFTSize(cols)
#nrows = 2048
#ncols = 2048

r = (ncols - cols)/2
b = (nrows - rows)/2
bordertype = cv2.BORDER_CONSTANT #just to avoid line breakup in PDF file
nimg = cv2.copyMakeBorder(image,b,b,r,r,bordertype, value = [255,255,255])

cv2.imwrite("padded_"+args["image"],nimg)

dft = cv2.dft(np.float32(nimg),flags = cv2.DFT_COMPLEX_OUTPUT)
dft_shift = np.fft.fftshift(dft)

magnitude, angle = cv2.cartToPolar(dft_shift[:,:,0],dft_shift[:,:,1]);
magnitude = np.log(abs(magnitude)+10.**-10)
minmag = min([min(x) for x in magnitude])
magnitude = magnitude - minmag
maxmag = max([max(x) for x in magnitude])
magnitude = ((255.)/(maxmag))*(magnitude)
angle=dft_shift[:,:,0]

#magnitude_spectrum=20*np.log(cv2.magnitude(dft_shift[:,:,0],dft_shift[:,:,1]))
#magnitude_test = 10*np.log(cv2.magnitude(dft_shift[:,:,0],dft_shift[:,:,1]))

radius=np.sqrt((nrows*nrows/2+ncols*ncols/2))
#prop=cv2.WARP_INVERSE_MAP
prop=cv2.WARP_FILL_OUTLIERS
center = (magnitude.shape[1]/2, magnitude.shape[0]/2)
img3=cv2.linearPolar(abs(magnitude), center ,radius,prop)
#img3=np.rot90(img3,axes=(-2,-1))

cv2.imwrite("fft_" + args["image"], magnitude)
cv2.imwrite("angle_" + args["image"], img3)
