# -*- coding: utf-8 -*-

from odoo import fields, models


class Order(models.Model):
    _name = 'nursery.order'
    _description = 'Nursery Order'

    plant_id = fields.Many2one("nursery.plant", required=True)
    customer_id = fields.Many2one("nursery.customer")
