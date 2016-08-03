import declare from 'dojo/_base/declare';
import array from 'dojo/_base/array';
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import action from '../../Action';
import SearchWidget from 'Sage/Platform/Mobile/SearchWidget';
import List from 'argos/List';


const __class = declare('crm.Views.PxSearch.AccountPxSearch', [List], {
  // Standard Item
  itemTemplate: new Simplate([
      '<h3>{%: this.formatDecimal($.Value5) %} mi | {%: $.Value2 %}</h3>',
      '<h4>{%: $.Value3 %} | {%: $.Value4 %}</h4>'
  ]),
  // overriding the stock rowTemplate with our custom key and descriptor
  rowTemplate: new Simplate([
      '<li data-action="activateEntry" data-key="{%= $.Value1 %}" data-descriptor="{%: $.Value2 %}">',
      '<button data-action="selectEntry" class="list-item-selector button">',
      '<img src="{%= $$.icon || $$.selectIcon %}" class="icon" />',
      '</button>',
      '<div class="list-item-content">{%! $$.itemTemplate %}</div>',
      '</li>'
  ]),

  formatDecimal: function formatDecimal(n) {
    return Math.round(n * 100)/100;
  },

  // TODO: add a search template for account type dropdown
  searchWidget: new SearchWidget({
    class: 'list-search',
    owner: this,
    onSearchExpression: lang.hitch(this, this._onSearchExpression),
    widgetTemplate: new Simplate([
        '<div class="search-widget" style="display: none;">', // hide the stock search stuff
        '<div class="table-layout">',
        '<div><input type="text" name="query" class="query" autocorrect="off" autocapitalize="off" data-dojo-attach-point="queryNode" data-dojo-attach-event="onfocus:_onFocus,onblur:_onBlur,onkeypress:_onKeyPress" /></div>',
        '<div class="hasButton"><button class="clear-button" data-dojo-attach-event="onclick: _onClearClick"></button></div>',
        '<div class="hasButton"><button class="subHeaderButton searchButton" data-dojo-attach-event="click: search">{%= $.searchText %}</button></div>',
        '</div>',
        '<label data-dojo-attach-point="labelNode">{%= $.searchText %}</label>',
        '</div>',
        '<div>Account Type:<select id="queryType" style="font-size: 16px"></select></div>'// add our own search stuff
    ])
  }),
  lat: null, // latitude
  lon: null, // longitude
  // Labels
  titleText: 'Accounts Near Me',
  icon: 'content/images/icons/Company_24.png',
  enableActions: true,
  security: 'Entities/Account/View',
  detailView: 'account_detail',
  // View Properties
  id: 'pxSearch_Accounts',
  queryOrderBy: 'AccountName',
  resourceKind: 'Accounts',//$app/mashups/-/mashups/('AccountDistanceSearch')/",
  allowSelection: true,
  enableActions: true,
  enableSearch: true,
  options: {},
  createRequest: function createRequest() {
    const request = new Sage.SData.Client.SDataBaseRequest(this.getService());
    request.uri.setPathSegment(0, '$app');
    request.uri.setPathSegment(1, 'mashups');
    request.uri.setPathSegment(2, '-');
    request.uri.setPathSegment(3, "mashups('AccountDistanceSearch')");
    request.uri.setPathSegment(4, '$queries');
    request.uri.setPathSegment(5, 'execute');
    request.uri.setQueryArg('format', 'JSON');
    request.uri.setQueryArg('_includeContent', true);
    request.uri.setQueryArg('_Lat', this.lat);
    request.uri.setQueryArg('_Lon', this.lon);
    request.uri.setQueryArg('_AccountType', this.acctType ? this.acctType : 'Customer');
    return request;
  },
  onRequestDataSuccess: function onRequestDataSuccess(feed) {
    this.processFeed(feed);
    domClass.remove(this.domNode, 'list-loading');
  },
  requestData: function requestData() {
    this.loadAccountTypes();
    domClass.add(this.domNode, 'list-loading');
    if (this.lat && this.lon) {
      const request = this.createRequest();
      request.service.readFeed(request, {
        success: this.onRequestDataSuccess,
        failure: this.onRequestDataFailure,
        aborted: this.onRequestDataAborted,
        scope: this,
      });
    }
    else {
      navigator.geolocation.getCurrentPosition(
        lang.hitch(this, "geoLocationReceived"), 
        lang.hitch(this, "geoLocationError"), { 
          enableHighAccuracy: true, 
        });
    }
  },
  geoLocationError: function geoLocationError(error) {
    alert('Unable to pull your current location. Cannot search.');
    domClass.remove(this.domNode, 'list-loading');
  },
  geoLocationReceived: function geoLocationReceived(position) {
    this.lat = position.coords.latitude;
    this.lon =  position.coords.longitude;
    this.requestData();
  },
  // only want the top 100 records
  hasMoreData: function hasMoreData() {
    return false;
  },
  // always refresh
  refreshRequiredFor: function refreshRequiredFor(options) {
    if (!options) { // if no options were passed in, then we are searching from an account
      this.lat = null;
      this.lon = null;
      this.options.title = 'Accounts Near Me';
    }
    return true;
  },
  createToolLayout: function createToolLayout() {
    return this.tools || (this.tools = {
      'tbar': [],
    });
  },
  init: function init() {
    this.startup();
    this.initConnects();
    this.titleEl = document.getElementById('pageTitle');
  },
  loadAccountTypes: function loadAccountTypes() {
    this.queryTypeEl = document.getElementById('queryType');
    this.queryTypeEl.onchange = lang.hitch(this, "onAccountTypeChange");//this.;
    const request = new Sage.SData.Client.SDataResourceCollectionRequest(App.getService())
      .setResourceKind('picklists')
      .setContractName('system');
    const uri = request.getUri();
    uri.setPathSegment(Sage.SData.Client.SDataUri.ResourcePropertyIndex, 'items');
    uri.setCollectionPredicate('name eq "Account Type"');
    request.allowCacheUse = true;
    request.read({
      success: this.onAccountTypeLoad,
      failure: function(xhr, o) { console.log('failed to load account type'); },
      scope: this
    });
  },
  onAccountTypeChange: function onAccountTypeChange() {
    this.acctType = this.queryTypeEl.value;
    this.clear();
    this.requestData();
  },
  onAccountTypeLoad: function onAccountTypeLoad(data) {
    if (this.queryTypeEl.options && this.queryTypeEl.options.length > 0) {
      return;
    }
    for (let i = 0; i < data.$resources.length; i++) {
      this.queryTypeEl.options[i] = new Option(data.$resources[i]['text'], data.$resources[i]['text'], true, false);
      if (this.queryTypeEl.options[i].value == 'Customer') {
        this.queryTypeEl.options[i].selected = 'True';
      }
    }
  },
  formatSearchQuuery: function formatSearchQuuery(qry) {
    return string.substitute('AccountName like "${0}%"', [this.escapeSearchQuery(qry)]);
  },
  processFeed: function processFeed(feed) {
    if (!this.feed) {
      this.set('listContent', '');
    }

    this.feed = feed;
    if (this.feed['$totalResults'] === 0) {
      this.set('listContent', this.noDataTemplate.apply(this));                
    } else if (feed['$resources']) {
      var o = [];
      for (let i = 0; i < feed['$resources'].length; i++) {
        const entry = feed['$resources'][i];
        entry['$descriptor'] = entry['Value2'];
        this.entries[entry.Value1] = entry;
        o.push(this.rowTemplate.apply(entry, this));
      }

      if (o.length > 0) {
        domConstruct.place(o.join(''), this.contentNode, 'last');
      }
    }

    // todo: add more robust handling when $totalResults does not exist, i.e., hide element completely
    if (typeof this.feed['$totalResults'] !== 'undefined') {
      const remaining = this.feed['$totalResults'] - (this.feed['$startIndex'] + this.feed['$itemsPerPage'] - 1);
      this.set('remainingContent', string.substitute(this.remainingText, [remaining]));
    }

    domClass.toggle(this.domNode, 'list-has-more', this.hasMoreData());
    if (this.options.allowEmptySelection) {
      domClass.add(this.domNode, 'list-has-empty-opt');
    }
    this._loadPreviousSelections();
  },
  createActionLayout: function createActionLayout() {
    return this.actions || (this.actions = [{
      id: 'callMain',
      icon: 'content/images/icons/Call_24x24.png',
      label: 'Call Main Phone',
      enabled: action.hasProperty.bindDelegate(this, 'Value6'),
      fn: action.callPhone.bindDelegate(this, 'Value6')
    },{
      id: 'viewContacts',
      icon: 'content/images/icons/Contacts_24x24.png',
      label: 'View Contacts',
      fn: this.navigateToRelatedView.bindDelegate(this, 'contact_related', 'Account.Id eq "${0}"')
    }]
    );
  },
});
export default __class;
