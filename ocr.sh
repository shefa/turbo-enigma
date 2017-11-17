if [ "$1" == "" ]; then
    echo "No image supplied."
    exit 1
fi

dpi=200
filter=40
offset=22
sharpen=2

if [ "$2" != "" ]; then
    dpi=$2
fi

if [ "$3" != "" ]; then
    filter=$3
fi

if [ "$4" != "" ]; then
    offset=$4
fi

if [ "$5" != "" ]; then
    sharpen=$5
fi

olddpi=$(convert $1 -format "%[resolution.x]" info:)

python /usr/bin/deskew.py --image "$1"

mogrify -density $olddpi "deskewed_$1"

convert -units PixelsPerInch "deskewed_$1" -resample "$dpi" "deskewed_dpi_$1"
textcleaner -g -e normalize -f "$filter" -o "$offset" -u -s "$sharpen" -a 0 -t 0 -T "deskewed_dpi_$1" "out_$1"
tesseract --psm 1 --oem 1 -l eng "out_$1" "out_$1" -c tessedit_write_images=true

rm "deskewed_$1"
rm "deskewed_dpi_$1"
rm *.osd
