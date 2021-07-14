import sys
import os
import getopt
import cv2 as cv
import numpy as np
from icecream import ic

def crop(out, loc_l, loc_r, hi, img_rgb):
    x_s = np.amax(loc_r[0])
    xs = np.amin(loc_l[0])
    ys = np.amin(loc_r[1])  # also use as x end
    ye = hi
    ic(x_s, ":", ye, ',', xs, ":", x_s,)
    crop_img = img_rgb[x_s:ye, xs:ys]  # add the dimensions later
    #cv.imshow("Final Crop",crop_img)
    # cv.waitKey(0)
    cv.imwrite(out+"_cropped.png", crop_img)


def point_pixels(out, img_rgb, loc_r, loc_l, wr, hl):
    mod_img = img_rgb
    # x coordinate range start: end,y coordinates range start: end
    right_corr_x_m = np.amax(loc_r[0])
    right_corr_y_m = np.amax(loc_r[1])
    mod_img[right_corr_x_m + wr:right_corr_x_m + 20 + wr,
            right_corr_y_m + wr:right_corr_y_m + 20 + wr] = [255, 212, 0]
    # supposed to the bottom box on top left -- FFD400 - yellow
    right_corr_x = np.amin(loc_r[0])
    right_corr_y = np.amin(loc_r[1])
    mod_img[right_corr_x:right_corr_x + 20,
            right_corr_y:right_corr_y + 20] = [107, 35, 143]
    # supposed to be the top box on top right -- 6B238F - purple
    left_corr_x_m = np.amax(loc_l[0])
    left_corr_y_m = np.amax(loc_l[1])
    mod_img[left_corr_x_m + hl:left_corr_x_m + 20 + hl,
            left_corr_y_m + hl:left_corr_y_m + 20 + hl] = [0, 234, 255]
    # supposed to be the bottom box on top right -- 00EAFF - sky blue
    left_corr_x = np.amin(loc_l[0])
    left_corr_y = np.amin(loc_l[1])
    mod_img[left_corr_x:left_corr_x + 20,
            left_corr_y:left_corr_y + 20] = [204, 204, 204]
    # supposed to be the top box on top left -- CCCCCC - white
    cv.imwrite(out+'_red_region.png', mod_img)


def make_rect(out, loc_r, img_rgb, wr, hr, hi, loc_l, wl, hl):
    for pt in zip(*loc_r[::-1]):
        cv.rectangle(img_rgb, pt, (pt[0] + wr, pt[1] + hr), (0, 0, 255), 2)
        cv.rectangle(img_rgb, pt, (pt[0] + wr +
                     hi, pt[1] + hr + hi), (0, 0, 255), 2)
    for pt in zip(*loc_l[::-1]):
        cv.rectangle(img_rgb, pt, (pt[0] + wl, pt[1] + hl), (0, 0, 255), 2)
        cv.rectangle(img_rgb, pt, (pt[0] + wl +
                     hi, pt[1] + hl + hi), (0, 0, 255), 2)
    cv.imwrite(out+'_squared_output.png', img_rgb)


'''def verbose():
    ic('\n', loc_l, '\n\n', loc_r)
    ic(loc_l[0][0], '\n', loc_r[0][0], '\n', hi, '\n', hi)'''


def locate_data(out, threshold, templateTomatch):
    cwd = os.getcwd()
    ic(templateTomatch, '\n', out+'_cropped.png')
    tempF = cv.imread(templateTomatch, 0)
    # out+'_cropped.png')
    ic(cwd+out+"_cropped.png")
    det_im = cv.imread(cwd+'/'+out+"_cropped.png")
    # '/home/sagnik/Projects/tesseract_backend_maphe/tests/outfile_cropped.png')
    img_gr = cv.cvtColor(det_im, cv.COLOR_BGR2GRAY)
    res = cv.matchTemplate(img_gr, tempF, cv.TM_CCOEFF_NORMED)
    '''cv.imshow("image", img_gr)
    cv.waitKey(0)
    cv.imshow("image", tempF)
    cv.waitKey(0)
    cv.imshow("image", res)
    cv.waitKey(0)'''
    try:
        for i in range(0, 10):
            ic("threshold = ", i/10)
            loc = np.where(res >= i/10)
            w, h = tempF.shape[::-1]
            x_m = np.amax(loc[0])
            y_m = np.amax(loc[1])
    except ValueError:
        i -= 1
        ic("threshold too high, trying a last accepatble value=", i/10)
        loc = np.where(res >= i/10)
        w, h = tempF.shape[::-1]
        x_m = np.amax(loc[0])
        y_m = np.amax(loc[1])
    #x_n = np.amin(loc[0])
    #ye = np.amin(loc[1])
    #ic(x_m, y_m, x_n, ye,h,w)
    crop_img = det_im[x_m:x_m+h, y_m:y_m+w]
    #cv.imshow("cropped", crop_img)
    # cv.waitKey(0)
    cv.imwrite(out+'_squared_output_res.png', crop_img)
    img_gr = cv.cvtColor(crop_img, cv.COLOR_BGR2GRAY)
    cv.imwrite(out+'_squared_output_res_grey.png', img_gr)


def main(argv):
    cwd = os.getcwd()
    inputfile = ''
    outputfile = ''
    try:
        opts, args = getopt.getopt(argv, "hi:o:", ["if=", "of="])
    except getopt.GetoptError:
        ic('detector.py -i <inputfile> -o <outputfile>')
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            ic('detector.py -i <inputfile> -o <outputfile>')
            sys.exit()
        elif opt in ("-i", "--if"):
            inputfile = arg
        elif opt in ("-o", "--of"):
            outputfile = arg
            outputfile = outputfile+'-'+inputfile
    ic(inputfile, outputfile)
    file = inputfile
    original_im = cv.imread(file, 0)
    img_rgb = cv.imread(file)
    ic(img_rgb.shape)
    img_gray = cv.cvtColor(img_rgb, cv.COLOR_BGR2GRAY)
    ic(cwd+'/templates/')
    templatel = cv.imread(cwd+'/templates/top_left.jpg', 0)
    templater_active = cv.imread(
        cwd+'/templates/top_right_swords_active.jpg', 0)
    templater_in_active = cv.imread(
        cwd+'/templates/top_right_swords_inactive.jpg', 0)
    stat_template = cv.imread(cwd+'/templates/top_right.jpg', 0)
    template = cv.imread(cwd+'/templates/necessary_col.jpg', 0)
    template_to_match = cwd+'/templates/necessary_col.jpg'
    ic(template, '\n', templatel, '\n',
          templater_in_active, '\n', templater_active)
    wi, hi = original_im.shape[::-1]
    wl, hl = templatel.shape[::-1]
    wr, hr = templater_active.shape[::-1]
    resl = cv.matchTemplate(img_gray, templatel, cv.TM_CCOEFF_NORMED)
    #resr = cv.matchTemplate(img_gray, templater_active, cv.TM_CCOEFF_NORMED)
    resr = cv.matchTemplate(img_gray, stat_template, cv.TM_CCOEFF_NORMED)
    threshold = 0.8  # tested and found
    loc_l = np.where(resl >= threshold)
    loc_r = np.where(resr >= threshold)
    try:
        ic('\nloc_l:', loc_l, '\n\nloc_r:', loc_r)
        ic(loc_l[0][0], '\n', loc_r[0][0], '\n', hi, '\n', hi)
        #templater = templater_active
    except IndexError:
        try:
            wr, hr = templater_in_active.shape[::-1]
            resr = cv.matchTemplate(
                img_gray, templater_in_active, cv.TM_CCOEFF_NORMED)
            loc_r = np.where(resr >= threshold)
            ic(loc_l[0][0], '\n', loc_r[0][0], '\n', hi, '\n', hi)
        except IndexError:
            wr, hr = templater_active.shape[::-1]
            resr = cv.matchTemplate(
                img_gray, templater_active, cv.TM_CCOEFF_NORMED)
            loc_r = np.where(resr >= threshold)
            ic(loc_l[0][0], '\n', loc_r[0][0], '\n', hi, '\n', hi)
        #templater = templater_in_active
    point_pixels(outputfile, img_rgb, loc_r, loc_l, wr, hl)
    make_rect(outputfile, loc_r, img_rgb, wr, hr, hi, loc_l, wl, hl)
    crop(outputfile, loc_l, loc_r, hi, img_rgb)
    locate_data(outputfile, threshold, template_to_match)


if __name__ == "__main__":
    main(sys.argv[1:])
