# -*- coding: utf-8 -*-

import base64
import json

from odoo import http
from odoo.http import request


class CustomizableTShirtController(http.Controller):

    @http.route(['/shop/creator/<model("product.template"):product>'], type="http", auth="public", website=True,
                method=['POST'],
                csrf=False)
    def creator(self, product):
        print(product.image_1920)
        render_values = {
            'product': product,
        }
        return request.render("customizable_t-shirt.customizable_t-shirt_page", render_values)

    @http.route(['/shop/creator/save_image/'], type="http", auth="public",
                website=True, method=['POST'],
                csrf=False)
    def save_image(self, custom_image, product_id):
        product = request.env['product.template'].search([('id', '=', product_id)])
        print(product.image_1920)
        _, b64data = custom_image.split(',')
        print(base64.b64decode(b64data))
        product.custom_image = base64.b64decode(b64data)
        print(product.custom_image)

        # render_values = {
        #     'product': product,
        # }
        # return request.render("customizable_t-shirt.customizable_t-shirt_page", render_values)
        return request.redirect("/shop")
