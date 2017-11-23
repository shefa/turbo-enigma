python ../preprocess/fft.py --image "$1" -e -bin 
python ../preprocess/split.py --image "deskewed_$1"
#python ../preprocess/fft.py --image "split_final_$1" -e -bin -v

#olddpi=$(convert "split_final_$1" -format "%[resolution.x]" info:)

#python ../preprocess/deskew.py --image "split_final_$1"
textcleaner -g -e normalize -f "$2" -o "$3" -u -s 1 -a 0 -t 0 -T "split_final_deskewed_$1" "out_$1"

tesseract --psm 1 --oem 1 -l eng "out_$1" "out_$1" -c tessedit_write_images=true
