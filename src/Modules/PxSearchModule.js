import declare from 'dojo/_base/declare';
import _ModuleBase from 'argos/Modules/_ModuleBase';
import AccountPxSearch from '../Views/PxSearch/AccountPxSearch';
import LocationPicker from '../Views/PxSearch/LocationPicker';
import ModuleManager from 'argos/Modules/ModuleManager';
import lang from 'dojo/_base/lang';

const __class = declare('crm.Modules.PxSearchModule', [_ModuleBase], {

  loadViews: function loadViews() {
    this.registerView(new AccountPxSearch());
    this.registerView(new LocationPicker());
  },
  loadCustomizations: function loadCustomizations() {

    //this.inherited(arguments);
    var originalDefViews = Mobile.SalesLogix.Application.prototype.getDefaultViews;
    lang.extend(Mobile.SalesLogix.Application, {
      getDefaultViews: function() {
        //Get view array from original function, or default to empty array
        var views = originalDefViews.apply(this, arguments) || [];
        //Add custom view(s)
        views.push('pxSearch_Accounts');
        views.push('pxSearch_locations');
        return views;
      }
    });
            
    this.registerAccountMods();


  },
  loadToolbars: function loadToolbars() {
  },
  registerAccountMods: function() {
    // add the view nearby button
    this.registerCustomization('detail', 'account_detail', {
      at: function(row) { return row.name === 'AddressesRelated'; },
      type: 'insert',
      value: {
        name: 'ViewNearbyAction',
        label: 'View Accounts Nearby',
        action: 'viewNearby',
        renderer: function() { return ""; },
        cls: 'related-item-label',
      }
    });
			
    // extend the view's class
    lang.extend(Mobile.SalesLogix.Views.Account.Detail, {				
      viewNearby: function() {
        if (!this.entry.Address.GPSLatitude || !this.entry.Address.GPSLongitude)
        {
          alert('Address is not geocoded properly, cannot search for nearby accounts.');
          return;
        }
        var view = App.getView('pxSearch_Accounts');
        view.refreshRequired = true;
        view.lat = this.entry.Address.GPSLatitude;
        view.lon = this.entry.Address.GPSLongitude;
        view.show({
          title: 'Accounts Near ' + this.entry.AccountName
        }, { });
      },
				
      querySelect: Mobile.SalesLogix.Views.Account.Detail.prototype.querySelect.concat([
          'Address/GPSLatitude',
          'Address/GPSLongitude'
      ])
    });
  }

});
ModuleManager.registerModule({
  name:'PxSearch',
  displayName: 'Px Search',
  ctor: __class,
});
export default __class;
