/*
* See copyright file.
*/
import declare from 'dojo/_base/declare';
import RelatedViewManager from 'argos/RelatedViewManager';
import _WidgetBase from '../../_WidgetBase';
import SalesNavigatorUri from '../../SalesNavigatorUri';

const __class = declare('crm.Integrations.SalesNavigator.ContactWidget', [_WidgetBase], {
  id: 'sales_navigator_base',
  initSalesNavigator: function initSalesNavigator(entry, container, applyScript) {
    const script = this.createEmptyScript().asJavascript();
    script.src = new SalesNavigatorUri()
      .asLead()
      .setFirstName(entry.FirstName)
      .setLastName(entry.LastName)
      .setEmail(entry.Email)
      .setCompanyName(entry.AccountName)
      .setCompanyWebsite(entry.WebAddress)
      .toString();
    applyScript(script);
  },
});

const rvm = new RelatedViewManager();
rvm.registerType('sales_navigator_contact', __class);
export default __class;
