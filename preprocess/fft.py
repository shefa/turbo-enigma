import numpy as np
import argparse
import cv2
import matplotlib.pyplot as plt

def normalize( img , val ):
    minmag = min(img.ravel())
    img2 = img - minmag
    maxmag = max(img2.ravel())
    img3 = (val/maxmag)*img2
    return img3
	
def remove_extreme ( img, k ):
    mf=img.ravel()
    maxmag = max(mf)
    secondmax=mf[0];
    if secondmax==maxmag :
        secondmax=mf[1]
    for x in mf:
        if x > secondmax and x != maxmag:
            secondmax=x
    img[np.unravel_index(img.argmax(),img.shape)]=k*secondmax

def make_linear_polar ( img ):
    nrows=img.shape[0]>>1
    ncols=img.shape[0]>>1
    radius=np.sqrt((nrows*nrows+ncols*ncols))
    #prop=cv2.WARP_INVERSE_MAP
    prop=cv2.WARP_FILL_OUTLIERS
    center = (ncols, nrows)
    return cv2.linearPolar(img, center,radius,prop)

def rotate( img, angle ):
    row = img.shape[0]
    col = img.shape[1]
    center = (row>>1, col>>1)
    rot_mat = cv2.getRotationMatrix2D(center,angle,1.0)
    return cv2.warpAffine(img, rot_mat, (col,row), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

def rotate_bound(image, angle):
    (h, w) = (image.shape[0], image.shape[1])
    (cX, cY) = (w>>1, h>>1)
    M = cv2.getRotationMatrix2D((cX, cY), angle, 1.0)
    cos = np.abs(M[0, 0])
    sin = np.abs(M[0, 1])
    nW = int((h * sin) + (w * cos))
    nH = int((h * cos) + (w * sin))
    M[0, 2] += (nW>>1) - cX
    M[1, 2] += (nH>>1) - cY
    return cv2.warpAffine(image, M, (nW, nH), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True, help="path to input image file")
ap.add_argument("-b", "--brightness", required=False, type=float,
        help="increasing brightness of fft spectrum", default=255.)
ap.add_argument("-x", "--hack", required=False, action="store_true",
        help="Detecting angles > 45")
ap.add_argument("-t", "--threshold", required=False, action="store_true",
        help="Binarise input image with threshold")
ap.add_argument("-e", "--extreme", required=False, action="store_true",
        help="Removes extreme from Fast Fourier Transform spectrum")
ap.add_argument("-ev", "--extremeval", required=False, type=int, default=1,
        help="Threshold value")
ap.add_argument("-v", "--verbose", required=False, action="store_true",
        help="Save images for different tasks")
ap.add_argument("-bin", "--binary", required=False, action="store_true",
        help="Pad image to a nice power of 2")
args = vars(ap.parse_args())

# load the image from disk
imgx = cv2.imread(args["image"])
image = cv2.cvtColor(imgx, cv2.COLOR_BGR2GRAY)
#image = cv2.imread(args["image"],0)

if args["threshold"]:
    blur=cv2.GaussianBlur(image,(5,5),0)
    image=cv2.threshold(blur,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)[1]

rows,cols = image.shape
nrows = cv2.getOptimalDFTSize(rows)
ncols = cv2.getOptimalDFTSize(cols)

nrows=max(nrows,ncols)
ncols=nrows

if args["binary"]:
    binpow=1<<(nrows-1).bit_length()
    nrows = binpow
    ncols = binpow

r = (ncols - cols)>>1
b = (nrows - rows)>>1
bordertype = cv2.BORDER_CONSTANT #just to avoid line breakup in PDF file
nimg = cv2.copyMakeBorder(image,b,b,r,r,bordertype, value = [255,255,255])

dft = cv2.dft(np.float32(nimg),flags = cv2.DFT_COMPLEX_OUTPUT)
dft_shift = np.fft.fftshift(dft)
magnitude, angle = cv2.cartToPolar(dft_shift[:,:,0],dft_shift[:,:,1]);
magnitude = np.sqrt(magnitude)
if args["extreme"]:
    remove_extreme(magnitude,args["extremeval"])
magnitude = normalize(magnitude,args["brightness"])

img3=make_linear_polar(magnitude)
img3=normalize(img3,255.)

x=[]

#for i in range(img3.shape[0]/2):
#    tmp3=[]
#    for j in range(img3.shape[1]):
#        tmp3.append((img3[i][j]+img3[i+((img3.shape[0]+1)/2)][j])/2. )
#    x.append(np.mean(tmp3))

for i in range(img3.shape[0]/2):
    x.append(np.mean(img3[i,:]))

ww = float(np.argmax(x)*180)/(len(x))
angle = ((90-ww))

if args["hack"]:
    if angle>45:
        angle=90-angle
    if angle<-45:
        angle=-(90+angle)

angle=-angle

deskewed = rotate_bound(imgx,angle);
cv2.imwrite("deskewed_"+args["image"], deskewed);

print "Angle: "+str(-angle)

if args["verbose"]:
    print "Full angle is "+str((360-ww))
    #cv2.imwrite("padded_"+args["image"],nimg)
    cv2.imwrite("fft_" + args["image"], magnitude)
    cv2.imwrite("fft_polar_" + args["image"], np.rot90(img3,axes=(-2,-1)) )
    plt.plot(x)
    plt.savefig("fft_polar_plot_" +args["image"]+".png")
