/* Copyright 2017 Infor
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import declare from 'dojo/_base/declare';
import action from '../../Action';
import format from '../../Format';
import template from '../../Template';
import MODEL_NAMES from '../../Models/Names';
import Detail from 'argos/Detail';
import getResource from 'argos/I18n';
import string from 'dojo/string';

const resource = getResource('contactDetail');

/**
 * @class crm.Views.Contact.Detail
 *
 * @extends argos.Detail
 *
 * @requires crm.Format
 * @requires crm.Template
 */
const __class = declare('crm.Views.Contact.Detail', [Detail], {
  // Localization
  accountText: resource.accountText,
  acctMgrText: resource.acctMgrText,
  addressText: resource.addressText,
  contactTitleText: resource.contactTitleText,
  createDateText: resource.createDateText,
  createUserText: resource.createUserText,
  emailText: resource.emailText,
  faxText: resource.faxText,
  homeText: resource.homeText,
  nameText: resource.nameText,
  ownerText: resource.ownerText,
  actionsText: resource.actionsText,
  relatedAccountsText: resource.relatedAccountsText,
  relatedActivitiesText: resource.relatedActivitiesText,
  relatedHistoriesText: resource.relatedHistoriesText,
  relatedItemsText: resource.relatedItemsText,
  relatedNotesText: resource.relatedNotesText,
  relatedOpportunitiesText: resource.relatedOpportunitiesText,
  relatedTicketsText: resource.relatedTicketsText,
  relatedAddressesText: resource.relatedAddressesText,
  relatedAttachmentText: resource.relatedAttachmentText,
  relatedAttachmentTitleText: resource.relatedAttachmentTitleText,
  titleText: resource.titleText,
  webText: resource.webText,
  workText: resource.workText,
  cuisinePreferenceText: resource.cuisinePreferenceText,
  callMobileNumberText: resource.callMobileNumberText,
  callWorkNumberText: resource.callWorkNumberText,
  calledText: resource.calledText,
  scheduleActivityText: resource.scheduleActivityText,
  addNoteText: resource.addNoteText,
  sendEmailText: resource.sendEmailText,
  viewAddressText: resource.viewAddressText,
  entityText: resource.entityText,

  // View Properties
  id: 'contact_detail',
  editView: 'contact_edit',
  historyEditView: 'history_edit',
  noteEditView: 'history_edit',
  enableOffline: true,
  resourceKind: 'contacts',
  modelName: MODEL_NAMES.CONTACT,

  navigateToHistoryInsert: function navigateToHistoryInsert(type, entry) {
    this.refreshRequired = true;
    action.navigateToHistoryInsert(entry);
  },
  recordCallToHistory: function recordCallToHistory(phoneNumber) {
    const entry = {
      $name: 'History',
      Type: 'atPhoneCall',
      ContactName: this.entry.NameLF,
      ContactId: this.entry.$key,
      AccountName: this.entry.AccountName,
      AccountId: this.entry.Account.$key,
      Description: string.substitute(this.calledText, [this.entry.Name]),
      UserId: App.context && App.context.user.$key,
      UserName: App.context && App.context.user.$descriptor,
      Duration: 15,
      CompletedDate: (new Date()),
    };

    this.navigateToHistoryInsert('atPhoneCall', entry);
    App.initiateCall(phoneNumber);
  },
  recordEmailToHistory: function recordEmailToHistory(email) {
    const entry = {
      $name: 'History',
      Type: 'atEMail',
      ContactName: this.entry.NameLF,
      ContactId: this.entry.$key,
      AccountName: this.entry.AccountName,
      AccountId: this.entry.Account.$key,
      Description: `Emailed ${this.entry.Name}`,
      UserId: App.context && App.context.user.$key,
      UserName: App.context && App.context.user.$descriptor,
      Duration: 15,
      CompletedDate: (new Date()),
    };

    this.navigateToHistoryInsert('atEMail', entry);
    App.initiateEmail(email);
  },
  callWorkPhone: function callWorkPhone() {
    this.recordCallToHistory(this.entry.WorkPhone);
  },
  callMobilePhone: function callMobilePhone() {
    this.recordCallToHistory(this.entry.Mobile);
  },
  sendEmail: function sendEmail() {
    this.recordEmailToHistory(this.entry.Email);
  },
  checkValueExists: function checkValueExists(entry, value) {
    return !value;
  },
  viewAddress: function viewAddress() {
    App.showMapForAddress(format.address(this.entry.Address, true, ' '));
  },
  checkAddress: function checkAddress(entry, value) {
    return !format.address(value, true, '');
  },
  scheduleActivity: function scheduleActivity() {
    App.navigateToActivityInsertView();
  },
  addNote: function addNote() {
    const view = App.getView(this.noteEditView);
    if (view) {
      view.show({
        template: {},
        insert: true,
      });
    }
  },
  createLayout: function createLayout() {
    return this.layout || (this.layout = [{
      list: true,
      title: this.actionsText,
      cls: 'action-list',
      name: 'QuickActionsSection',
      children: [{
        name: 'CallWorkPhoneAction',
        property: 'WorkPhone',
        label: this.callWorkNumberText,
        action: 'callWorkPhone',
        iconClass: 'phone',
        disabled: this.checkValueExists,
        renderer: format.phone.bindDelegate(this, false),
      }, {
        name: 'CallMobilePhoneAction',
        property: 'Mobile',
        label: this.callMobileNumberText,
        action: 'callMobilePhone',
        iconClass: 'phone',
        disabled: this.checkValueExists,
        renderer: format.phone.bindDelegate(this, false),
      }, {
        name: 'ScheduleActivityAction',
        label: this.scheduleActivityText,
        action: 'scheduleActivity',
        iconClass: 'calendar',
        tpl: new Simplate([
          '{%: $.AccountName %} / {%: $.NameLF %}',
        ]),
      }, {
        name: 'AddNoteAction',
        property: 'NameLF',
        label: this.addNoteText,
        action: 'addNote',
        iconClass: 'quick-edit',
      }, {
        name: 'SendEmailAction',
        property: 'Email',
        label: this.sendEmailText,
        action: 'sendEmail',
        iconClass: 'mail',
        disabled: this.checkValueExists,
      }, {
        name: 'ViewAddressAction',
        property: 'Address',
        label: this.viewAddressText,
        action: 'viewAddress',
        iconClass: 'map-pin',
        disabled: this.checkAddress,
        renderer: format.address.bindDelegate(this, true, ' '),
      }],
    }, {
      title: this.detailsText,
      name: 'DetailsSection',
      children: [{
        name: 'NameLF',
        property: 'NameLF',
        label: this.nameText,
      }, {
        name: 'AccountName',
        property: 'AccountName',
        descriptor: 'AccountName',
        label: this.accountText,
        view: 'account_detail',
        key: 'Account.$key',
      }, {
        name: 'WorkPhone',
        property: 'WorkPhone',
        label: this.workText,
        renderer: format.phone,
      }, {
        name: 'AccountManager.UserInfo',
        property: 'AccountManager.UserInfo',
        label: this.acctMgrText,
        tpl: template.nameLF,
      }, {
        name: 'HomePhone',
        property: 'HomePhone',
        label: this.homeText,
        renderer: format.phone,
      }, {
        name: 'WebAddress',
        property: 'WebAddress',
        label: this.webText,
        renderer: format.link,
      }, {
        name: 'Title',
        property: 'Title',
        label: this.contactTitleText,
      }, {
        name: 'Fax',
        property: 'Fax',
        label: this.faxText,
        renderer: format.phone,
      }, {
        name: 'Owner.OwnerDescription',
        property: 'Owner.OwnerDescription',
        label: this.ownerText,
      }, {
        name: 'CuisinePreference',
        property: 'CuisinePreference',
        label: this.cuisinePreferenceText,
      }],
    }, {
      title: this.relatedItemsText,
      name: 'RelatedItemsSection',
      list: true,
      children: [{
        name: 'ActivityRelated',
        label: this.relatedActivitiesText,
        view: 'activity_related',
        where: this.formatRelatedQuery.bindDelegate(this, 'ContactId eq "${0}"'),
      }, {
        name: 'OpportunityRelated',
        label: this.relatedOpportunitiesText,
        view: 'opportunity_related',
        where: this.formatRelatedQuery.bindDelegate(this, 'Contacts.Contact.Id eq "${0}"'),
      }, {
        name: 'TicketRelated',
        label: this.relatedTicketsText,
        view: 'ticket_related',
        where: this.formatRelatedQuery.bindDelegate(this, 'Contact.Id eq "${0}"'),
      }, {
        name: 'HistoryRelated',
        label: this.relatedHistoriesText,
        where: this.formatRelatedQuery.bindDelegate(this, 'ContactId eq "${0}" and Type ne "atDatabaseChange"'),
        view: 'history_related',
      }, {
        name: 'AddressesRelated',
        label: this.relatedAddressesText,
        where: this.formatRelatedQuery.bindDelegate(this, 'EntityId eq "${0}"', 'Address.EntityId'),
        view: 'address_related',
      }, {
        name: 'AttachmentRelated',
        label: this.relatedAttachmentText,
        where: this.formatRelatedQuery.bindDelegate(this, 'contactId eq "${0}"'), // must be lower case because of feed
        view: 'contact_attachment_related',
        title: this.relatedAttachmentTitleText,
      }],
    }]);
  },
});

export default __class;
