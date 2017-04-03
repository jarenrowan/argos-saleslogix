import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import List from 'argos/List';
import MODEL_NAMES from '../../Models/Names';
import getResource from 'argos/I18n';

const resource = getResource('locationsList');

const __class = declare('crm.Integrations.BOE.Views.Locations.List', [List], {
  // Templates
  itemTemplate: new Simplate([
    '<p class="micro-text">{%: $.Name %}</p>',
    '<p class="listview-heading">{%: $.Description %}</p>',
    '<p class="micro-text">{%: $.ErpStatus %}</p>',
  ]),

  // Localization
  titleText: resource.titleText,

  // View Properties
  id: 'locations_list',
  detailView: '',
  modelName: MODEL_NAMES.LOCATION,
  resourceKind: 'slxLocations',
  enableActions: false,
  expose: false,

  // Card layout
  itemIconClass: '',

  // Metrics
  entityName: 'Location',

  createToolLayout: function createToolLayout() {
    return this.tools || (this.tools = {
    });
  },
  formatSearchQuery: function formatSearchQuery(searchQuery) {
    const q = this.escapeSearchQuery(searchQuery.toUpperCase());
    return `upper(Description) like "${q}%" or upper(ErpLogicalId) like "${q}%"`;
  },
});

lang.setObject('icboe.Views.Locations.List', __class);
export default __class;
