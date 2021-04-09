# -*- coding: utf-8 -*-

import json

from odoo import http
from odoo.http import request


class CustomizableTShirtController(http.Controller):

    @http.route(['/shop/creator/<model("product.template"):product>'], type="http", auth="public", website=True,
                method=['POST'],
                csrf=False)
    def example(self, product):
        print(product)
        render_values = {
            'product': product,
        }
        return request.render("customizable_t-shirt.customizable_t-shirt_page", render_values)
