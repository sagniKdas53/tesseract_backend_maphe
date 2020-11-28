import cv2 as cv
import numpy as np


def crop():
    x_s = np.amax(loc_r[0])
    xs = np.amin(loc_l[0])
    ys = np.amin(loc_r[1]) # also use as x end
    ye = hi
    print(x_s,":",ye,',',xs,":",x_s,)
    crop_img = img_rgb[x_s:ye,xs:ys] #add the dimensions later
    #cv.imshow("Final Crop",crop_img)
    #cv.waitKey(0)
    cv.imwrite('/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/temp/cropped.png', crop_img)


def point_pixels():
    mod_img = img_rgb
    # x coordinate range start: end,y coordinates range start: end
    right_corr_x_m = np.amax(loc_r[0])
    right_corr_y_m = np.amax(loc_r[1])
    mod_img[right_corr_x_m + wr:right_corr_x_m + 20 + wr, right_corr_y_m + wr:right_corr_y_m + 20 + wr] = [255,212,0]
    #supposed to the bottom box on top left -- FFD400 - yellow
    right_corr_x = np.amin(loc_r[0])
    right_corr_y = np.amin(loc_r[1])
    mod_img[right_corr_x:right_corr_x + 20, right_corr_y:right_corr_y + 20] = [107,35,143]
    #supposed to be the top box on top right -- 6B238F - purple
    left_corr_x_m = np.amax(loc_l[0])
    left_corr_y_m = np.amax(loc_l[1])
    mod_img[left_corr_x_m + hl:left_corr_x_m + 20 + hl, left_corr_y_m + hl:left_corr_y_m + 20 + hl] = [0,234,255]
    #supposed to be the bottom box on top right -- 00EAFF - sky blue
    left_corr_x = np.amin(loc_l[0])
    left_corr_y = np.amin(loc_l[1])
    mod_img[left_corr_x:left_corr_x + 20, left_corr_y:left_corr_y + 20] = [204,204,204]
    #supposed to be the top box on top left -- CCCCCC - white
    cv.imwrite('/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/temp/red_region.png', mod_img)


def make_rect():
    for pt in zip(*loc_r[::-1]):
        cv.rectangle(img_rgb, pt, (pt[0] + wr, pt[1] + hr), (0, 0, 255), 2)
        cv.rectangle(img_rgb, pt, (pt[0] + wr + hi, pt[1] + hr + hi), (0, 0, 255), 2)
    for pt in zip(*loc_l[::-1]):
        cv.rectangle(img_rgb, pt, (pt[0] + wl, pt[1] + hl), (0, 0, 255), 2)
        cv.rectangle(img_rgb, pt, (pt[0] + wl + hi, pt[1] + hl + hi), (0, 0, 255), 2)
    cv.imwrite('/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/temp/squared_output.png', img_rgb)


def verbose():
    print('\n', loc_l, '\n\n', loc_r)
    print(loc_l[0][0], '\n', loc_r[0][0], '\n', hi, '\n', hi)

def locate_data():
    tempF = cv.imread('/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/templates/necessary_col.jpg',0)
    det_im = cv.imread('/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/temp/cropped.png')
    img_gr = cv.cvtColor(det_im, cv.COLOR_BGR2GRAY)
    res = cv.matchTemplate(img_gr, tempF, cv.TM_CCOEFF_NORMED)
    loc = np.where(res >= threshold)
    w, h = tempF.shape[::-1]
    x_m = np.amax(loc[0])
    y_m = np.amax(loc[1])
    #x_n = np.amin(loc[0])
    #ye = np.amin(loc[1])
    #print(x_m, y_m, x_n, ye,h,w)
    crop_img = det_im[x_m:x_m+h, y_m:y_m+w]
    #cv.imshow("cropped", crop_img)
    #cv.waitKey(0)
    cv.imwrite('/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/temp/squared_output_res.png', crop_img)
    img_gr = cv.cvtColor(crop_img, cv.COLOR_BGR2GRAY)
    cv.imwrite('/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/temp/squared_output_res_grey.png', img_gr)


file = '/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/shots/left_hidden,decrease_stat,some_other_true.jpg'
original_im = cv.imread(file, 0)
img_rgb = cv.imread(file)
print(img_rgb.shape)
img_gray = cv.cvtColor(img_rgb, cv.COLOR_BGR2GRAY)
templatel = cv.imread('/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/templates/top_left.jpg', 0)
templater = cv.imread('/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/templates/top_right.jpg', 0)
wi, hi = original_im.shape[::-1]
wl, hl = templatel.shape[::-1]
wr, hr = templater.shape[::-1]
resl = cv.matchTemplate(img_gray, templatel, cv.TM_CCOEFF_NORMED)
resr = cv.matchTemplate(img_gray, templater, cv.TM_CCOEFF_NORMED)
threshold = 0.8
loc_l = np.where(resl >= threshold)
loc_r = np.where(resr >= threshold)

verbose()
point_pixels()
make_rect()
crop()
locate_data()



