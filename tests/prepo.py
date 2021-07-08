import sys
import getopt
import cv2 as cv
import numpy as np


def main(argv):
    inputfile = ''
    outputfile = ''
    try:
        opts, args = getopt.getopt(argv,"hi:o:",["if=","of="])
    except getopt.GetoptError:
        print ('prepo.py -i <inputfile> -o <outputfile>')
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print ('prepo.py -i <inputfile> -o <outputfile>')
            sys.exit()
        elif opt in ("-i", "--if"):
            inputfile = arg
        elif opt in ("-o", "--of"):
            outputfile = arg
    print(inputfile,outputfile)
    file = inputfile
    original_im = cv.imread(file, 0)
    img_rgb = cv.imread(file)
    print(img_rgb.shape)
    img = cv.cvtColor(img_rgb, cv.COLOR_BGR2GRAY)
    kernel = np.ones((1, 1), np.uint8)
    img = cv.dilate(img, kernel, iterations=1)
    img = cv.erode(img, kernel, iterations=1)
    img = cv.GaussianBlur(img, (5, 5), 0) # this is the point where resuts seem the best...
    img = cv.threshold(img, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)[1]
    cv.imwrite(outputfile, img)

if __name__ == "__main__":
   main(sys.argv[1:])