# -*- coding: utf-8 -*-

{
    'name': "Customizable T-shirt",
    'author': "O'Labs",
    'website': "http://www.olabs.be",
    'description': """;
        Add a page for customize you T-shirt
    """,
    'sequence': 1,
    'category': 'tools',
    'version': '1.0',
    'depends': ['website', 'website_sale'],
    'data': [
        'security/ir.model.access.csv',
        'views/product_template_views.xml',
        'views/sale_views.xml',
        'views/templates.xml',
    ],
    'installable': True,
}
