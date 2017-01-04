import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import query from 'dojo/query';
import ApplicationModule from 'argos/ApplicationModule';
import Calendar from 'argos/Calendar';
import 'argos/RelatedViewManager';
import 'argos/RelatedViewWidget';
import List from 'argos/List';
import Signature from 'argos/Views/Signature';
import SearchWidget from 'argos/SearchWidget';
import FileSelect from 'argos/Views/FileSelect';
import AddAccountContact from './Views/AddAccountContact';
import AreaCategoryIssueLookup from './Views/AreaCategoryIssueLookup';
import ExchangeRateLookup from './Views/ExchangeRateLookup';
import MainToolbar from './Views/MainToolbar';
import UpdateToolbar from './Views/UpdateToolbar';
import LeftDrawer from './Views/LeftDrawer';
import RightDrawer from './Views/RightDrawer';
import OfflineDetail from './Views/Offline/Detail';
import OfflineList from './Views/Offline/List';
import Login from './Views/Login';
import LogOff from './Views/LogOff';
import Settings from './Views/Settings';
import Configure from './Views/Configure';
import Help from './Views/Help';
import NameEdit from './Views/NameEdit';
import PickList from './Views/PickList';
import SelectList from './Views/SelectList';
import SpeedSearchList from './Views/SpeedSearchList';
import TextEdit from './Views/TextEdit';
import AccountList from './Views/Account/List';
import AccountDetail from './Views/Account/Detail';
import AccountEdit from './Views/Account/Edit';
import AddressList from './Views/Address/List';
import AddressEdit from './Views/Address/Edit';
import ActivityList from './Views/Activity/List';
import MyDayList from './Views/Activity/MyDay';
import MyActivityList from './Views/Activity/MyList';
import ActivityDetail from './Views/Activity/Detail';
import ActivityEdit from './Views/Activity/Edit';
import ActivityComplete from './Views/Activity/Complete';
import ActivityTypesList from './Views/Activity/TypesList';
import ActivityRecurring from './Views/Activity/Recurring';
import CalendarView from './Views/Calendar/CalendarView';
import DayView from './Views/Calendar/DayView';
import MonthView from './Views/Calendar/MonthView';
import WeekView from './Views/Calendar/WeekView';
import GenericBar from './Views/Charts/GenericBar';
import GenericLine from './Views/Charts/GenericLine';
import GenericPie from './Views/Charts/GenericPie';
import CompetitorList from './Views/Competitor/List';
import ContactList from './Views/Contact/List';
import ContactDetail from './Views/Contact/Detail';
import ContactEdit from './Views/Contact/Edit';
import ContractList from './Views/Contract/List';
import ErrorLogList from './Views/ErrorLog/List';
import ErrorLogDetail from './Views/ErrorLog/Detail';
import EventList from './Views/Event/List';
import EventDetail from './Views/Event/Detail';
import EventEdit from './Views/Event/Edit';
import GroupsSelector from './Views/Groups/Selector';
import LeadList from './Views/Lead/List';
import LeadDetail from './Views/Lead/Detail';
import LeadEdit from './Views/Lead/Edit';
import LeadSourceList from './Views/LeadSource/List';
import OpportunityList from './Views/Opportunity/List';
import OpportunityDetail from './Views/Opportunity/Detail';
import OpportunityEdit from './Views/Opportunity/Edit';
import OpportunityQuickEdit from './Views/Opportunity/QuickEdit';
import OpportunityContactList from './Views/OpportunityContact/List';
import OpportunityContactDetail from './Views/OpportunityContact/Detail';
import OpportunityContactEdit from './Views/OpportunityContact/Edit';
import OpportunityProductList from './Views/OpportunityProduct/List';
import OpportunityProductDetail from './Views/OpportunityProduct/Detail';
import OpportunityProductEdit from './Views/OpportunityProduct/Edit';
import OwnerList from './Views/Owner/List';
import ProductList from './Views/Product/List';
import ProductProgramList from './Views/ProductProgram/List';
import TicketList from './Views/Ticket/List';
import TicketDetail from './Views/Ticket/Detail';
import TicketEdit from './Views/Ticket/Edit';
import TicketUrgencyLookup from './Views/Ticket/UrgencyLookup';
import TicketActivityList from './Views/TicketActivity/List';
import TicketActivityDetail from './Views/TicketActivity/Detail';
import TicketActivityEdit from './Views/TicketActivity/Edit';
import TicketActivityRateLookup from './Views/TicketActivity/RateLookup';
import TicketActivityItemList from './Views/TicketActivityItem/List';
import TicketActivityItemDetail from './Views/TicketActivityItem/Detail';
import HistoryList from './Views/History/List';
import HistoryDetail from './Views/History/Detail';
import HistoryEdit from './Views/History/Edit';
import './Views/History/RelatedView';
import CalendarAccessList from './Views/User/CalendarAccessList';
import UserList from './Views/User/List';
import ViewAttachment from './Views/Attachment/ViewAttachment';
import AttachmentList from './Views/Attachment/List';
import AddAttachment from './Views/Attachment/AddAttachment';
import MyAttachmentList from './Views/Attachment/MyAttachmentList';
import RecentlyViewedList from './Views/RecentlyViewed/List';
import BriefcaseList from './Views/Briefcase/List';
import OfflineOptionsEdit from './Views/OfflineOptions/Edit';
import getResource from 'argos/I18n';
import MODEL_NAMES from './Models/Names';
import MODEL_TYPES from 'argos/Models/Types';
import './Views/OfflineOptions/UsageWidget';
import './Fields/AddressField';
import './Fields/MultiCurrencyField';
import './Fields/NameField';
import './Fields/PicklistField';
import './Fields/RecurrencesField';
import './Views/RelatedContextWidget';
import './Views/RelatedEditWidget';
import './Action';
import './Format';
import './Template';
import './Validator';
import './Environment';
import './Utility';
import './Models/Account/Offline';
import './Models/Account/SData';
import './Models/Activity/Offline';
import './Models/Activity/SData';
import './Models/Contact/Offline';
import './Models/Contact/SData';
import './Models/Integration/SData';
import './Models/Lead/Offline';
import './Models/Lead/SData';
import './Models/LeadAddress/Offline';
import './Models/LeadAddress/SData';
import './Models/Opportunity/Offline';
import './Models/Opportunity/SData';
import './Models/UserActivity/Offline';
import './Models/UserActivity/SData';
import './Models/Address/Offline';
import './Models/Address/SData';
import './Models/History/Offline';
import './Models/History/SData';
import './Models/Ticket/Offline';
import './Models/Ticket/SData';
import './Models/Authentication/Offline';

const resource = getResource('applicationModule');

/**
 * @class crm.ApplicationModule
 *
 * @extends argos.ApplicationModule
 * @requires argos.Calendar
 * @requires argos.RelatedViewManager
 * @requires argos.RelatedViewWidget
 * @requires argos.List
 * @requires argos.Views.Signature
 * @requires argos.Views.FileSelect
 * @requires argos.SearchWidget
 *
 */
const __class = declare('crm.ApplicationModule', [ApplicationModule], {
  searchText: resource.searchText,
  loadViews: function loadViews() {
    this.inherited(arguments);

    this.registerView(new Calendar({
      expose: false,
      app: this.application,
    }));

    this.registerView(new Signature({
      expose: false,
      app: this.application,
    }));

    this.registerView(new Login({ app: this.application }));
    this.registerView(new LogOff({ app: this.application }));

    this.registerView(new LeftDrawer({ app: this.application }), query('.left-drawer')[0]);
    this.registerView(new RightDrawer({ app: this.application }), query('.right-drawer')[0]);

    this.registerView(new OfflineDetail({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new OfflineList({
      expose: false,
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new RecentlyViewedList({
      expose: true,
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new BriefcaseList({
      expose: true,
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new Help({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new Settings({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new Configure({ app: this.application }));
    this.registerView(new PickList({ app: this.application }));
    this.registerView(new SelectList({ app: this.application }));
    this.registerView(new SpeedSearchList({ app: this.application }));
    this.registerView(new AddAccountContact({ app: this.application }));
    this.registerView(new AreaCategoryIssueLookup({ app: this.application }));
    this.registerView(new ExchangeRateLookup({ app: this.application }));
    this.registerView(new FileSelect({ app: this.application }));

    this.registerView(new NameEdit({ app: this.application }));
    this.registerView(new TextEdit({ app: this.application }));
    this.registerView(new AddressList({
      id: 'address_related',
      expose: false,
      defaultSearchTerm: function defaultSearchTerm() {
        return '';
      },
      app: this.application,
    }));
    this.registerView(new AddressEdit({ app: this.application }));

    this.registerView(new AccountList({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new AccountDetail({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new AccountEdit({ app: this.application }));
    this.registerView(new AccountList({
      id: 'account_related',
      expose: false,
      groupsEnabled: false,
      defaultSearchTerm: function defaultSearchTerm() {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new CalendarView({ app: this.application }));
    this.registerView(new DayView({ app: this.application }));
    this.registerView(new MonthView({ app: this.application }));
    this.registerView(new WeekView({ app: this.application }));

    // Charts
    this.registerView(new GenericBar({
      expose: false,
      app: this.application,
    }));
    this.registerView(new GenericLine({
      expose: false,
      app: this.application,
    }));
    this.registerView(new GenericPie({
      expose: false,
      app: this.application,
    }));

    this.registerView(new CompetitorList({
      id: 'competitor_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new ContactList({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new ContactDetail({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new ContactEdit({ app: this.application }));
    this.registerView(new ContactList({
      id: 'contact_related',
      expose: false,
      groupsEnabled: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new ContractList({
      id: 'contract_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new ErrorLogList({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new ErrorLogDetail({
      canRedirectTo: true,
      app: this.application,
    }));

    this.registerView(new EventEdit({ app: this.application }));
    this.registerView(new EventList({
      expose: false,
      app: this.application,
    }));
    this.registerView(new EventDetail({ app: this.application }));
    this.registerView(new EventList({
      id: 'event_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new GroupsSelector({ app: this.application }));

    this.registerView(new OpportunityEdit({ app: this.application }));
    this.registerView(new OpportunityQuickEdit({ app: this.application }));
    this.registerView(new OpportunityList({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new OpportunityDetail({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new OpportunityList({
      id: 'opportunity_related',
      expose: false,
      groupsEnabled: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new OpportunityContactEdit({ app: this.application }));
    this.registerView(new OpportunityContactList({ app: this.application }));
    this.registerView(new OpportunityContactDetail({ app: this.application }));
    this.registerView(new OpportunityContactList({
      id: 'opportunitycontact_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new OpportunityProductList({
      id: 'opportunityproduct_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new OpportunityProductDetail({
      id: 'opportunityproduct_detail',
      expose: false,
      app: this.application,
    }));

    this.registerView(new OpportunityProductEdit({
      id: 'opportunityproduct_edit',
      expose: false,
      app: this.application,
    }));

    this.registerView(new LeadEdit({ app: this.application }));
    this.registerView(new LeadList({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new LeadDetail({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new LeadList({
      id: 'lead_related',
      expose: false,
      groupsEnabled: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new TicketList({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new TicketDetail({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new TicketEdit({ app: this.application }));
    this.registerView(new TicketList({
      id: 'ticket_related',
      expose: false,
      groupsEnabled: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new TicketActivityList({ app: this.application }));
    this.registerView(new TicketActivityDetail({ app: this.application }));
    this.registerView(new TicketActivityEdit({ app: this.application }));
    this.registerView(new TicketActivityRateLookup({ app: this.application }));
    this.registerView(new TicketActivityList({
      id: 'ticketactivity_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new TicketActivityItemList({ app: this.application }));
    this.registerView(new TicketActivityItemDetail({ app: this.application }));
    this.registerView(new TicketActivityItemList({
      id: 'ticketactivityitem_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new ActivityDetail({
      canRedirectTo: true,
      app: this.application,
    }));
    this.registerView(new ActivityEdit({ app: this.application }));
    this.registerView(new ActivityComplete({ app: this.application }));
    this.registerView(new ActivityTypesList({ app: this.application }));
    this.registerView(new ActivityList({
      id: 'activity_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new MyDayList({ app: this.application }));
    this.registerView(new MyActivityList({ app: this.application }));
    this.registerView(new ActivityRecurring({ app: this.application }));

    this.registerView(new HistoryDetail({ app: this.application }));
    this.registerView(new HistoryList({ app: this.application }));
    this.registerView(new HistoryEdit({ app: this.application }));
    this.registerView(new HistoryList({
      id: 'history_related',
      expose: false,
      groupsEnabled: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new CalendarAccessList({
      expose: false,
      app: this.application,
    }));

    this.registerView(new UserList({
      expose: false,
      app: this.application,
    }));

    this.registerView(new OwnerList({
      expose: false,
      app: this.application,
    }));

    this.registerView(new ProductList({
      id: 'product_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new ProductProgramList({
      id: 'productprogram_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));

    this.registerView(new LeadSourceList({
      expose: false,
      app: this.application,
    }));

    this.registerView(new TicketUrgencyLookup({
      expose: false,
      app: this.application,
    }));

    this.registerView(new ViewAttachment({ app: this.application }));
    this.registerView(new AddAttachment({ app: this.application }));
    this.registerView(new MyAttachmentList({ app: this.application }));
    this.registerView(new AttachmentList({
      id: 'account_attachment_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));
    this.registerView(new AttachmentList({
      id: 'contact_attachment_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));
    this.registerView(new AttachmentList({
      id: 'lead_attachment_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));
    this.registerView(new AttachmentList({
      id: 'ticket_attachment_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));
    this.registerView(new AttachmentList({
      id: 'opportunity_attachment_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));
    this.registerView(new AttachmentList({
      id: 'activity_attachment_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));
    this.registerView(new AttachmentList({
      id: 'history_attachment_related',
      expose: false,
      defaultSearchTerm: () => {
        return '';
      },
      app: this.application,
    }));
    this.registerView(new OfflineOptionsEdit({
      expose: false,
      app: this.application,
    }));
  },
  loadToolbars: function loadToolbars() {
    this.inherited(arguments);

    this.registerToolbar(new MainToolbar({
      name: 'tbar',
      app: this.application,
    }));

    this.registerToolbar(new UpdateToolbar({
      name: 'updatebar',
      app: this.application,
    }));
  },
  loadCustomizations: function loadCustomizations() {
    this.loadBaseCustomizations();
  },
  loadBaseCustomizations: function loadBaseCustomizations() {
    lang.extend(List, {
      expose: true,
      getSecurity: function getSecurity() {
        return (this.expose && this.security); // only check security on exposed views
      },
    });

    lang.extend(SearchWidget, {
      searchText: this.searchText,
    });
  },
  /**
   * @deprecated typo, use loadAppStatePromises instead.
   */
  loadAppStatPromises: function loadAppStatPromises() {
    // Redirect to the typo fix.
    this.loadAppStatePromises();
  },
  loadAppStatePromises: function loadAppStatePromises() {
    this.registerAppStatePromise({
      seq: 1,
      description: resource.userContextAndOptionsText,
      items: [{
        name: 'user_detail',
        description: resource.userInformationText,
        fn: () => this.application.requestUserDetails(),
      }, {
        name: 'user_options',
        description: resource.userOptionsText,
        fn: () => this.application.requestUserOptions(),
      }, {
        name: 'system_options',
        description: resource.systemOptionsText,
        fn: () => this.application.requestSystemOptions(),
      }, {
        name: 'integrations',
        description: resource.integrationsText,
        fn: () => {
          const model = this.application.ModelManager.getModel(MODEL_NAMES.INTEGRATION, MODEL_TYPES.SDATA, { app: this.application });
          return model.getEntries().then((results) => {
            this.application.context.integrations = results;
            return results;
          });
        },
      }],
    });
  },
});

lang.setObject('Mobile.SalesLogix.ApplicationModule', __class);
export default __class;
