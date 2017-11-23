rm deskewed*
for x in *.jpg; do python fft.py -i $x -e -bin; done
for x in *.png; do python fft.py -i $x -e -bin; done
