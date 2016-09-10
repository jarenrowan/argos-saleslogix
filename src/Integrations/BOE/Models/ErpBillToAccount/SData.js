import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import Base from './Base';
import _SDataModelBase from 'argos/Models/_SDataModelBase';
import Manager from 'argos/Models/Manager';
import MODEL_TYPES from 'argos/Models/Types';
import MODEL_NAMES from '../Names';

const __class = declare('crm.Integrations.BOE.Models.ErpBillToAccount.SData', [Base, _SDataModelBase], {
  id: 'erpbilltoaccount_sdata_model',
  createQueryModels: function createQueryModels() {
    return [{
      name: 'list',
      queryOrderBy: 'CreateDate desc',
      querySelect: [
        'ErpBillTo/Name',
        'ErpBillTo/Address/FullAddress',
        'CreateDate',
      ],
    }, {
      name: 'detail',
      querySelect: [
        'ErpBillTo/Name',
        'ErpBillTo/Address/*',
        'ErpBillTo/ErpStatus',
        'ErpBillTo/MainPhone',
        'ErpBillTo/Fax',
        'ErpBillTo/Email',
        'ErpBillTo/PaymentTermId',
      ],
    },
    ];
  },
});

Manager.register(MODEL_NAMES.ERPBILLTOACCOUNT, MODEL_TYPES.SDATA, __class);
lang.setObject('icboe.Models.ErpBillToAccount.SData', __class);
export default __class;
