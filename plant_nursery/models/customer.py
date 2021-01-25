# -*- coding: utf-8 -*-

from odoo import fields, models


class Customer(models.Model):
    _name = 'nusrsery.customer'
    _description = 'Nursery Customer'

    name = fields.Char("Customer Name", required=True)
    email = fields.Char(help='To receive the newsletter')
