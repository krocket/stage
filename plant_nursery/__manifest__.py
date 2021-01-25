# -*- coding: utf-8 -*-

{
    'name': 'Plant nursery',
    'version': '1.0',
    'category': 'Tools',
    'summary': 'Plants and Customers Management',
    'depends': ['web'],
    'data': [
        'security/ir.model.access.csv',
        'views/nursery_plant_views.xml',
        'views/nursery_customer_views.xml',
        'views/nursery_order_views.xml',
    ],
    'demo': [
    ],
    'css': [],
    'installable': True,
    'auto_install': False,
    'application': True,
}