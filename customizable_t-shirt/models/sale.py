# -*- coding: utf-8 -*-

from odoo import fields, models, api


class SaleOrder(models.Model):
    _inherit = "sale.order"

    name = fields.Char()


class SaleOrderLine(models.Model):
    _inherit = "sale.order.line"

    custom_image = fields.Image(string='Image')
