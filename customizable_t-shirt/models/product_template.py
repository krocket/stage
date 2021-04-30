# -*- coding: utf-8 -*-

from odoo import fields, models


class ProductTemplateExtension(models.Model):
    _inherit = 'product.template'

    is_customizable = fields.Boolean(string="Is customizable ?")
    is_creator = fields.Boolean(string="Is creator ?")
    product_template_creator_image_ids = fields.One2many('product.creator.image', 'product_tmpl_id',
                                                         string="Extra creator content", copy=True)
