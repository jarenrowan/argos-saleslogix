import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import domConstruct from 'dojo/dom-construct';
import domAttr from 'dojo/dom-attr';
import Deferred from 'dojo/Deferred';
import when from 'dojo/when';
import promiseAll from 'dojo/promise/all';
import query from 'dojo/query';
import utility from 'argos/Utility';
import SDataStore from'argos/Store/SData';
import FieldManager from 'argos/FieldManager';
import Edit from 'argos/Edit';

const __class = declare( 'crm.Views.LeadQualification.Edit', [Edit], {
  // Localization
  titleText: 'Lead Qualification',

  // View Properties
  _qualSectionBeginTemplate: new Simplate([
     '<h2 id="_qualificationsNodeHeader"  data-action="toggleSection" class="{% if ($.collapsed || $.options.collapsed) { %}collapsed{% } %}">',
     '{%: ($.title || $.options.title) %}<button class="collapsed-indicator" aria-label="{%: $$.toggleCollapseText %}"></button>',
     '</h2>',
      '<fieldset id="_qualificationsNodeFields" class="{%= ($.cls || $.options.cls) %}">',
  ]),
  _qualSectionEndTemplate: new Simplate([
     '</fieldset>',
  ]),
  id: 'lead_qualifications_edit',
  entityName: 'Lead',
  querySelect: [
      'LeadId',
      'QualificationCategory',
      'QualificationCategory/CategoryName',
  ],
  resourceKind: 'leads',
  _leadQualStore: null,
  _defStore: null,
  _defEntries: null,
  _leadQualEntries: null,
  _qualFields: null,
  _refreshQaulifactions: false,
  init: function init() {
    this.inherited(arguments);
    this.connect(this.fields.QualificationCategory, 'onChange', this.onCategoryChange);
    this._leadQualStore = new SDataStore({
      service: App.services.crm,
      resourceKind: 'leadQualifications',
      contractName: this.contractName,
      scope: this,
    });
    this._defStore = new SDataStore({
      service: App.services.crm,
      resourceKind: 'qualifications',
      contractName: this.contractName,
      scope: this,
    });
  },
  onCategoryChange: function onCategoryChange(value) {
    let leadKey;
    let catKey;
    leadKey = this._leadKey;
    catKey = value.key;
    this._loadDefs(leadKey, catKey);
  },
  createLayout: function createLayout() {
    return this.layout || (this.layout = [{
      name: 'LeadId',
      property: 'LeadId',
      type: 'hidden',
    }, {
      label: 'Qualification Category',
      name: 'QualificationCategory',
      property: 'QualificationCategory',
      type: 'lookup',
      textProperty: 'CategoryName',
      view: 'qualification_category_list',
    }]);
  },
  onBeforeTransitionTo: function onBeforeTransitionTo() {
    if (this._refreshQaulifactions) {
      this._refreshQaulifactions = false;
      this.refresh();
    }
  },
  setValues: function setValues(values) {
    let catKey;
    let leadKey;
    this.inherited(arguments);
    if (values.QualificationCategory && values.QualificationCategory.$key) {
      catKey = values.QualificationCategory && values.QualificationCategory.$key;
    } else {
      catKey = values.QualificationCategory;
    }
    leadKey = values.$key;
    this._loadDefs(leadKey, catKey);
  },
  _loadDefs: function _loadDefs(leadKey, catKey) {
    let results;
    let self;
    self = this;
    this._leadKey = leadKey;
    this._catKey = catKey;
    this._defEntries = null;
    this._leadQualEntries = null;
    this._destroyQualifications();
    if (catKey) {
      results = this._fetchDefs(catKey);
      results.then(function(defs) {
        self._defEntries = defs;
        self._loadQaulifications(leadKey, catKey);
      });
    }
  },
  _loadQaulifications: function _loadQaulification(leadKey, catKey) {
    let results;
    let self;
    self = this;
    this._refreshQaulifactions = false;
    results = this._fetchLeadQaulifications(leadKey, catKey);
    results.then(function(items) {
      self._leadQualEntries = items;
      self._processQualifications();
    });
  },
  _fetchDefs: function _fetchDefs(catKey) {
    let queryOptions;
    let queryResults;
    let where;
    const def = new Deferred();
    where = string.substitute("QualificationCategory.Id eq '${0}'", [catKey]);
    queryOptions = {
      where: where,
      sort: 'SortPosition',
    };
    queryResults = this._defStore.query(null, queryOptions);

    when(queryResults, function(feed) {
      def.resolve(feed);
    }, function(err) {
      def.reject(err);
    });

    return def.promise;
  },
  _fetchLeadQaulifications: function _fetchLeadQaulifications(leadKey, catKey) {
    let queryOptions;
    let queryResults;
    let where;
    const def = new Deferred();
    where = string.substitute("Lead.Id eq '${0}' and Qualification.QualificationCategory.Id eq '${1}'", [leadKey, catKey]);
    queryOptions = {
      where: where,
      sort: '',
    };
    queryResults = this._leadQualStore.query(null, queryOptions);

    when(queryResults, function(feed) {
      def.resolve(feed);
    }, function(err) {
      def.reject(err);
    });

    return def.promise;
  },
  _processQualifications: function _processQualifications() {
    let i;
    let def;
    let rowNode;
    let Ctor;
    let field;
    let content;
    let template;
    let fieldDef;

    this._qualFields = {};
    content = [];
    content.push(this._qualSectionBeginTemplate.apply({ options: { collapsed: false, title: 'Qualifications' } }, this));
    for (i = 0; i < this._defEntries.length; i++) {
      def = this._defEntries[i];
      try {
        if (def.Visible) {
          fieldDef = {
            label: def.$descriptor,
            type: 'boolean',
            name: 'checked_' + def.$key,
            onText: 'yes',
            offText: 'no',
            data: def,
          };
          Ctor = FieldManager.get(fieldDef.type);
          field = this._qualFields[fieldDef.name] = new Ctor(lang.mixin({
            owner: this,
          }, fieldDef));
          template = field.propertyTemplate || this.propertyTemplate;
          content.push(template.apply(field, this));

          this.connect(field, 'onShow', this._onShowField);
          this.connect(field, 'onHide', this._onHideField);
          this.connect(field, 'onEnable', this._onEnableField);
          this.connect(field, 'onDisable', this._onDisableField);

          if (def.ShowNotes) {
            fieldDef = {
              label: 'note',
              type: 'text',
              name: 'note_' + def.$key,
              data: def,
            };
            Ctor = FieldManager.get(fieldDef.type);
            field = this._qualFields[fieldDef.name] = new Ctor(lang.mixin({
              owner: this,
            }, fieldDef));
            template = field.propertyTemplate || this.propertyTemplate;
            content.push(template.apply(field, this));
            this.connect(field, 'onShow', this._onShowField);
            this.connect(field, 'onHide', this._onHideField);
            this.connect(field, 'onEnable', this._onEnableField);
            this.connect(field, 'onDisable', this._onDisableField);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    content.push(this._qualSectionEndTemplate.apply({}, this));
    rowNode = domConstruct.toDom(content.join(''));
    this._qualificationsNode = rowNode;
    domConstruct.place(rowNode, this.contentNode, 'last');

    query('div[data-field]', this.contentNode).forEach(function(node) {
      const xname = domAttr.get(node, 'data-field');
      const xfield = this._qualFields[xname];
      if (xfield) {
        xfield.renderTo(node);
      }
    }, this);

    this._setQualifactions();
  },
  _destroyQualifications: function _destroyQualifications() {
    let field;
    let name;
    for (name in this._qualFields) {
      if (this._qualFields[name]) {
        field = this._qualFields[name];
        field.destroy();
      }
    }
    domConstruct.destroy('_qualificationsNodeHeader');
    domConstruct.destroy('_qualificationsNodeFields');
  },
  _setQualifactions: function _setQualifactions() {
    let i;
    let lqf;
    let defkey;
    let field;
    for (i = 0; i < this._leadQualEntries.length; i++) {
      lqf = this._leadQualEntries[i];
      defkey = lqf.Qualification.$key;
      field = this._qualFields['checked_' + defkey];
      if (field) {
        field.setValue(utility.getValue(lqf, 'Checked'), true);
      }
      field = this._qualFields['note_' + defkey];
      if (field) {
        field.setValue(utility.getValue(lqf, 'Notes'), true);
      }
    }
  },
  _getQualifactions: function _getQualifactions() {
    let i;
    const payloads = [];
    let payload;
    let def;
    for (i = 0; i < this._defEntries.length; i++) {
      def = this._defEntries[i];
      if (def.Visible) {
        payload = this._getQualification(def.$key);
        if (payload) {
          payloads.push(payload);
        }
      }
    }
    return payloads;
  },
  _getQualification: function _getQualification(defKey) {
    let payload = {};
    let field;
    let name;
    let lqf;
    let value;
    let hasChange = false;
    lqf = this._getleadQualifcationByDef(defKey);
    if (lqf) {
      payload.$key = lqf.$key; // already exists
    } else {
      payload.Lead = { $key: this._leadKey }; // need to insert
      payload.Qualification = { $key: defKey };
    }
    for (name in this._qualFields) {
      if (name === ('checked_' + defKey)) {
        field = this._qualFields[name];
        value = field.getValue();
        if (field.isDirty()) {
          utility.setValue(payload, 'Checked', value);
          hasChange = true;
        }
      }
      if (name === ('note_' + defKey)) {
        field = this._qualFields[name];
        value = field.getValue();
        if (field.isDirty()) {
          utility.setValue(payload, 'Notes', value);
          hasChange = true;
        }
      }
    }
    if (!hasChange) {
      payload = null;
    }
    return payload;
  },
  _getleadQualifcationByDef: function _getleadQualifcationByDef(defKey) {
    let i;
    if (this._leadQualEntries) {
      for (i = 0; i < this._leadQualEntries.length; i++) {
        if (this._leadQualEntries[i].Qualification.$key === defKey) {
          return this._leadQualEntries[i];
        }
      }
    }
    return null;
  },
  _getleadQualifcation: function _getleadQualifcation(key) {
    let i;
    if (this._leadQualEntries) {
      for (i = 0; i < this._leadQualEntries.length; i++) {
        if (this._leadQualEntries[i].$key === key) {
          return this._leadQualEntries[i];
        }
      }
    }
    return null;
  },
  update: function update(updateFinished) {
    if (updateFinished) {
      this.inherited(arguments);
    } else {
      this._updateQualifications();
    }
  },
  _updateQualifications: function _updateQualifications() {
    const self = this;
    const payloads = this._getQualifactions();
    const updates = [];
    let i;
    for (i = 0; i < payloads.length; i++) {
      if (payloads[i].$key) {
        updates.push(this._updateQual(payloads[i]));
      } else {
        updates.push(this._insertQual(payloads[i]));
      }
    }
    promiseAll(updates).then(function() {
      self._refreshQaulifactions = true;
      self.update(true);
    });
  },
  _updateQual: function _updateQual(entry) {
    let store;
    let putOptions;
    const def = new Deferred();
    let queryResults;
    store = this._leadQualStore;
    if (store) {
      putOptions = {
        overwrite: true,
        id: store.getIdentity(entry),
      };
      queryResults = store.put(entry, putOptions);
      when(queryResults, function(feed) {
        def.resolve(feed);
      }, function(err) {
        def.reject(err);
      });
    }
    return def.promise;
  },
  _insertQual: function _insertQual(entry) {
    let store;
    let addOptions;
    const def = new Deferred();
    let queryResults;
    store = this._leadQualStore;
    if (store) {
      addOptions = {
        overwrite: false,
      };

      queryResults = store.add(entry, addOptions);
      when(queryResults, function(feed) {
        def.resolve(feed);
      }, function(err) {
        def.reject(err);
      });
    }

    return def.promise;
  },

});
export default __class;

