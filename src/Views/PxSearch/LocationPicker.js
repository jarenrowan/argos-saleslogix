import declare from 'dojo/_base/declare';
import array from 'dojo/_base/array';
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import domClass from 'dojo/dom-class';
import domConstruction from 'dojo/dom-construct';
import List from 'argos/List';

const __class = declare('crm.Views.PxSearch.LocationPicker', [List], {
  itemTemplate: new Simplate([
      '<h3>{%: $.Name %}</h3>'
  ]),
  // overriding the stock rowTemplate with our custom key and descriptor
  rowTemplate: new Simplate([
      '<li data-action="activateEntry" data-key="{%: $.$key %}" data-descriptor="{%: $.$descriptor %}" data-lat="{%: $.Address.SSSGeocodedAddresses.$resources[0].GPSLatitude %}" data-lon="{%: $.Address.SSSGeocodedAddresses.$resources[0].GPSLongitude %}">',
      '<button data-action="selectEntry" class="list-item-selector button">',
      '<img src="{%= $$.icon || $$.selectIcon %}" class="icon" />',
      '</button>',
      '<div class="list-item-content">{%! $$.itemTemplate %}</div>',
      '</li>'
  ]),
  titleText: 'Proximity Search',
  icon: 'content/images/icons/Map_24.png',
  enableActions: false,
  enableSearch: true,
  queryOrderBy: 'Name',
  allowSelection: true,
  id: 'pxSearch_locations',
  pageSize: 400,
  //queryWhere: '(Userid eq null or Userid eq "' + App.context.user.$key + '")',
  resourceKind: 'pointsOfInterest',
  querySelect: [
      'Name',
      'Address/GPSLatitude',
      'Address/GPSLongitude'
  ],
  onShow: function onShow() {
    this.queryWhere = '(Userid eq null or Userid eq "' + App.context.user.$key + '")';
  },
  // custom request data success method to insert our "me" at the front
  onRequestDataSuccess: function  onRequestDataSuccess(feed) {
    const feedResources = feed.$resources;
    feedResources.unshift({
      '$descriptor': 'Me',
      '$key': 'Me',
      'Name': 'My Current Location',
      'Address': {
        'SSSGeocodedAddresses': {
          '$resources': [
              {
                'GPSLatitude': null,
                'GPSLongitude': null
              }
          ]
        }
      }
    });
    this.processFeed(feed);
    domClass.remove(this.domNode, 'list-loading');
  },
  // custom activateEntry method since we aren't actually opening a detail view
  activateEntry: function activateEntry(params) {
    const view = App.getView('pxSearch_Accounts');
    if (params.key == "Me") {
      view.show();
    } else {
      view.lat = params.lat;
      view.lon = params.lon;
      view.show({
        title: 'Accounts Near ' + params.descriptor,
      }, { });
    }
  },
  formatSearchQuery: function formatSearchQuery(searchQuery) {
    return this.queryWhere + string.substitute(' and Name like "%${0}%"', [this.escapeSearchQuery(searchQuery)]);
  },
});
export default __class;