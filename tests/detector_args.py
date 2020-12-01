import cv2 as cv
import numpy as np


def make_rect(loc_r,img_rgb,wr,hr,hi,dest,red,green,blue):
    for pt in zip(*loc_r[::-1]):
        cv.rectangle(img_rgb, pt, (pt[0] + wr, pt[1] + hr), (red,green,blue), 2)
        cv.rectangle(img_rgb, pt, (pt[0] + wr + hi, pt[1] + hr + hi), (red,green,blue), 2)
    cv.imwrite(dest, img_rgb)

def main(file,templ,des,r,g,b):
    original_im = cv.imread(file, 0)
    img_rgb = cv.imread(file)
    print(img_rgb.shape)
    img_gray = cv.cvtColor(img_rgb, cv.COLOR_BGR2GRAY)
    templatel = cv.imread(templ, 0)
    wi, hi = original_im.shape[::-1]
    wl, hl = templatel.shape[::-1]
    resl = cv.matchTemplate(img_gray, templatel, cv.TM_CCOEFF_NORMED)
    threshold = 0.8
    loc_l = np.where(resl >= threshold)

    make_rect(loc_l,cv.imread(file),wl,hl,hi,des,r,g,b)

main("/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/shots/left_hidden,mixed_stat,some_other_false.jpg",
    "/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/templates/attack.jpg",
    "/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/temp/attack.jpg",0,0,255)

main("/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/shots/left_hidden,mixed_stat,some_other_false.jpg",
    "/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/templates/cdam.jpg",
    "/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/temp/cdam.jpg",0,255,0)