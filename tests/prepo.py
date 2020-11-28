import cv2 as cv
import numpy as np

file = '/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/temp/squared_output_res.png'
original_im = cv.imread(file, 0)
img_rgb = cv.imread(file)
print(img_rgb.shape)
img = cv.cvtColor(img_rgb, cv.COLOR_BGR2GRAY)
kernel = np.ones((1, 1), np.uint8)
img = cv.dilate(img, kernel, iterations=1)
img = cv.erode(img, kernel, iterations=1)
img = cv.GaussianBlur(img, (5, 5), 0) # this is the point where resuts seem the best...
img = cv.threshold(img, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)[1]
cv.imwrite("/home/sagnik/Vs Code/maphe.github.io/tesseract.js-offline-master/images/temp/output_res_dil_er_gra-thrs.png", img)

