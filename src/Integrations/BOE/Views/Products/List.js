import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import List from 'argos/List';
import format from 'crm/Format';
import MODEL_NAMES from '../../Models/Names';
import getResource from 'argos/I18n';

const resource = getResource('productsList');

const __class = declare('crm.Integrations.BOE.Views.Products.List', [List], {
  formatter: format,
  // Templates
  itemTemplate: new Simplate([
    '<p class="listview-heading">{%: $.Name %}</p>',
    '{% if ($.Description) { %}',
    '<p class="micro-text">{%: $.Description %}</p>',
    '{% } %}',
    '{% if ($.Family) { %}',
    '<p class="micro-text"><label class="group-label">{%: $$.familyText %}</label> {%: $.Family %}</p>',
    '{% } %}',
    '{% if ($.Status) { %}',
    '<p class="micro-text"><label class="group-label">{%: $$.statusText %}</label> {%: $.Status %}</p>',
    '{% } %}',
    '{% if ($.Price) { %}',
    '<p class="micro-text"><label class="group-label">{%: $$.priceText %} </label>',
    '{% if (App.hasMultiCurrency() && $.CurrencyCode) { %}',
    '{%: $$.formatter.multiCurrency($.Price, $.CurrencyCode) %}',
    '{% } else { %}',
    '{%: $$.formatter.currency($.Price) %} ',
    '{% } %}</p>',
    '{% } %}',
  ]),

  // Localization
  titleText: resource.titleText,
  familyText: resource.familyText,
  statusText: resource.statusText,
  priceText: resource.priceText,

  // View Properties
  id: 'products_list',
  detailView: '',
  modelName: MODEL_NAMES.PRODUCT,
  resourceKind: 'products',
  enableActions: false,
  expose: false,
  security: 'Entities/Product/View',
  insertSecurity: 'Entities/Product/Add',

  // Card layout
  itemIconClass: '',

  // Metrics
  entityName: 'Product',

  createToolLayout: function createToolLayout() {
    return this.tools || (this.tools = {
    });
  },
  formatSearchQuery: function formatSearchQuery(searchQuery) {
    return string.substitute('upper(Name) like "${0}%" or upper(Family) like "${0}%" or ActualId like "${0}%"', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
  },
});

lang.setObject('icboe.Views.Products.List', __class);
export default __class;
