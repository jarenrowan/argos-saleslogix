import declare from 'dojo/_base/declare';
import _ModelBase from 'argos/_ModelBase';
import all from 'dojo/promise/all';
import Deferred from 'dojo/Deferred';
import _SDataModelMixin from 'argos/_SDataModelMixin';
import ErrorManager from 'argos/ErrorManager';

export default declare('crm.Models.Ticket', [_ModelBase, _SDataModelMixin], {
  entityName: 'Ticket',
  resourceKind: 'tickets',
  security: 'Entities/Ticket/View',
  querySelect: [
    'Account/AccountName',
    'Account/MainPhone',
    'Area',
    'AssignedDate',
    'AssignedTo/OwnerDescription',
    'Category',
    'Contact/NameLF',
    'Contact/WorkPhone',
    'Contract/ReferenceNumber',
    'Issue',
    'NeededByDate',
    'Notes',
    'ViaCode',
    'StatusCode',
    'UrgencyCode',
    'Subject',
    'TicketNumber',
    'TicketProblem/Notes',
    'TicketSolution/Notes',
    'Urgency/Description',
    'Urgency/UrgencyCode',
    'CompletedBy/OwnerDescription',
  ],
  createPicklistPromise: function createPicklistPromise(predicate, options) {
    const request = new Sage.SData.Client.SDataResourceCollectionRequest(App.getService())
      .setResourceKind('picklists')
      .setContractName('system');
    const uri = request.getUri();
    const def = new Deferred();

    uri.setPathSegment(Sage.SData.Client.SDataUri.ResourcePropertyIndex, 'items');
    uri.setCollectionPredicate(predicate);

    request.allowCacheUse = true;

    request.read({
      success: (data) => {
        def.resolve(data.$resources);
      },
      failure: (response, o) => {
        ErrorManager.addError(response, o, options, 'failure');
        def.reject(response);
      },
    });

    return def.promise;
  },
  getEntry: function getEntry(options) {
    const results$ = this.inherited(arguments);
    const status$ = this.createPicklistPromise('name eq "Ticket Status"', options);
    const source$ = this.createPicklistPromise('name eq "Source"', options);
    return all([results$, status$, source$])
      .then(([entry, status, source]) => {
        // Transform the entry with our fetched picklist values instead of the key/code
        entry.ViaCode = source.filter((item) => {
          return item.$key === entry.ViaCode;
        }).map((item) => item.text)[0];

        entry.StatusCode = status.filter((item) => {
          return item.$key === entry.StatusCode;
        }).map((item) => item.text)[0];
        return entry;
      });
  },
});
