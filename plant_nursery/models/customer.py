# -*- coding: utf-8 -*-

from odoo import fields, models


class Customer(models.Model):
    _name = 'nursery.customer'
    _description = 'Nursery Customer'

    name: fields.Char("Customer Name", required=True)
    description: fields.Char(help="To receive te newsletter")
