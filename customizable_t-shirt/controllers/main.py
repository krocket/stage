# -*- coding: utf-8 -*-

import base64
import json

from array import *
from odoo import http
from odoo.addons.website.controllers.main import QueryURL
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale


class WebsiteSaleInherit(WebsiteSale):
    @http.route(['/shop/test'], type='http', auth='public', website=True, sitemap=True, csrf=False)
    def test(self, product_id, product_qty_to_send, product_ids_to_send):
        product = request.env['product.template'].search([('id', '=', product_id)])
        sale_order = request.website.sale_get_order(force_create=True)
        tab_product = []
        tab_qty = product_qty_to_send.split(',')
        print(tab_qty)
        self._convert_product_string_to_array(product_ids_to_send, tab_product)
        i = 0
        for product_string in tab_product:
            for product_variant in product.product_variant_ids:
                if product_variant.product_template_attribute_value_ids.__str__() == product_string:
                    sale_order._cart_update_t_shirt(
                        product_id=product.id,
                        add_qty=int(tab_qty[i]),
                        received_combination=product_variant.product_template_attribute_value_ids,
                    )
                    print(product_variant.product_template_attribute_value_ids)
            i += 1
        return request.redirect("/shop/cart")

    @staticmethod
    def _convert_product_string_to_array(product_ids_to_send, tab_product):
        tmp_string = ''
        for char in product_ids_to_send:
            tmp_string += char
            if char == ')':
                if tmp_string.startswith(','):
                    tmp_string = tmp_string[1:len(tmp_string)]
                    tab_product.append(tmp_string)
                    tmp_string = ''
                else:
                    tab_product.append(tmp_string)
                    tmp_string = ''

    @http.route(['/shop/<model("product.template"):product>'], type='http', auth="public", website=True, sitemap=True)
    def product(self, product, category='', search='', **kwargs):
        if not product.can_access_from_current_website():
            raise NotFound()
        attributes = product.valid_product_template_attribute_line_ids
        sizes = []
        for i in attributes:
            for j in i.value_ids:
                if not i.attribute_id.display_type == 'color':
                    sizes.append(j)
        product_colors = []
        product_variants = []
        for product_variant in product.product_variant_ids:
            for variant in product_variant.product_template_attribute_value_ids:
                if variant.display_type == 'color':
                    if not product_colors.__contains__(variant):
                        product_colors.append(variant)
                else:
                    for size in sizes:
                        if not variant.name != size.name:
                            product_variants.append(variant)
        color_size = {}
        for color in product_colors:
            i = 0
            tab = []
            while i < len(sizes):
                if product_variants[0].name != sizes[i].name:
                    tab.append('')
                    i += 1
                else:
                    # rajouter à product_variants[0] un .name pour montrer qu'on récupère bien les bonnes valeurs
                    tab.append(product_variants[0])
                    product_variants.pop(0)
                    i += 1
            color_size.update({color: tab})
        print(color_size)

        return request.render("website_sale.product",
                              self._prepare_product_values_shirt(product, category, search, sizes, color_size,
                                                                 **kwargs))

    def _prepare_product_values_shirt(self, product, category, search, sizes, color_size, **kwargs):
        add_qty = int(kwargs.get('add_qty', 1))

        product_context = dict(request.env.context, quantity=add_qty,
                               active_id=product.id,
                               partner=request.env.user.partner_id)
        ProductCategory = request.env['product.public.category']

        if category:
            category = ProductCategory.browse(int(category)).exists()

        attrib_list = request.httprequest.args.getlist('attrib')
        attrib_values = [[int(x) for x in v.split("-")] for v in attrib_list if v]
        attrib_set = {v[1] for v in attrib_values}

        keep = QueryURL('/shop', category=category and category.id, search=search, attrib=attrib_list)

        categs = ProductCategory.search([('parent_id', '=', False)])

        pricelist = request.website.get_current_pricelist()

        if not product_context.get('pricelist'):
            product_context['pricelist'] = pricelist.id
            product = product.with_context(product_context)

        # Needed to trigger the recently viewed product rpc
        view_track = request.website.viewref("website_sale.product").track

        return {
            'search': search,
            'category': category,
            'pricelist': pricelist,
            'attrib_values': attrib_values,
            'attrib_set': attrib_set,
            'keep': keep,
            'categories': categs,
            'main_object': product,
            'product': product,
            'add_qty': add_qty,
            'view_track': view_track,
            'sizes': sizes,
            'color_size': color_size,
        }


class CustomizableTShirtController(http.Controller):

    @http.route(['/shop/creator/<model("product.template"):product>'], type="http", auth="public", website=True,
                method=['POST'],
                csrf=False)
    def creator(self, product):
        product_images = list(product.product_template_image_ids)
        product_images.insert(0, product)
        render_values = {
            'product': product,
            'product_images': product_images,
            'creator_images': list(product.product_template_creator_image_ids)
        }
        # return request.render("customizable_t-shirt.customizable_t-shirt_page", render_values)
        return request.render("customizable_t-shirt.article", render_values)

    @http.route(['/shop/creator/save_image/'], type="http", auth="public",
                website=True, method=['POST'],
                csrf=False)
    def save_image(self, custom_image, product_id):
        product = request.env['product.template'].search([('id', '=', product_id)])
        _, b64data = custom_image.split(',')
        img_data = base64.b64decode(b64data)
        product.image_1920 = base64.b64encode(img_data)

        return request.redirect("/shop")

    # @http.route(['/shop/creator/save_image/'], type="http", auth="public",
    #             website=True, method=['POST'],
    #             csrf=False)
    # def save_image(self, custom_image, product_id):
    #     product = request.env['product.template'].search([('id', '=', product_id)])
    #     _, b64data = custom_image.split(',')
    #     img_data = base64.b64decode(b64data)
    #     product.image_1920 = base64.b64encode(img_data)
    #     return request.redirect("/shop")
