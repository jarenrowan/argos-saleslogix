define('crm/Views/Charts/_ChartMixin', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/connect', 'dojo/dom-geometry', 'dojo/dom-attr', 'dojo/has', 'argos/_PullToRefreshMixin'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseConnect, _dojoDomGeometry, _dojoDomAttr, _dojoHas, _argos_PullToRefreshMixin) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _connect = _interopRequireDefault(_dojo_baseConnect);

  var _domGeo = _interopRequireDefault(_dojoDomGeometry);

  var _domAttr = _interopRequireDefault(_dojoDomAttr);

  var _has = _interopRequireDefault(_dojoHas);

  var _PullToRefreshMixin2 = _interopRequireDefault(_argos_PullToRefreshMixin);

  /**
   * @class crm.Views.Charts._ChartMixin
   *
   * @mixins argos._PullToRefreshMixin
   * @requires argos._PullToRefreshMixin
   *
   * Base mixin for creating chart views.
   *
   */
  _lang['default'].setObject('Chart.defaults.global', {
    // Boolean - Whether to animate the chart
    animation: false,

    // Number - Number of animation steps
    animationSteps: 60,

    // String - Animation easing effect
    animationEasing: 'easeOutQuart',

    // Boolean - If we should show the scale at all
    showScale: true,

    // Boolean - If we want to override with a hard coded scale
    scaleOverride: false,

    // ** Required if scaleOverride is true **
    // Number - The number of steps in a hard coded scale
    scaleSteps: null,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: null,
    // Number - The scale starting value
    scaleStartValue: null,

    // String - Colour of the scale line
    scaleLineColor: 'rgba(0,0,0,.1)',

    // Number - Pixel width of the scale line
    scaleLineWidth: 1,

    // Boolean - Whether to show labels on the scale
    scaleShowLabels: true,

    // Interpolated JS string - can access value
    scaleLabel: '<%=value%>',

    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
    scaleIntegersOnly: true,

    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero: false,

    // String - Scale label font declaration for the scale label
    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Scale label font size in pixels
    scaleFontSize: 12,

    // String - Scale label font weight style
    scaleFontStyle: 'normal',

    // String - Scale label font colour
    scaleFontColor: '#666',

    // Boolean - whether or not the chart should be responsive and resize when the browser does.
    responsive: true,

    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,

    // Boolean - Determines whether to draw tooltips on the canvas or not
    showTooltips: true,

    // Array - Array of string names to attach tooltip events
    tooltipEvents: ['touchstart', 'click'],

    // String - Tooltip background colour
    tooltipFillColor: 'rgba(0,0,0,0.8)',

    // String - Tooltip label font declaration for the scale label
    tooltipFontFamily: "'Helvetica', 'Arial', Sans-serif",

    // Number - Tooltip label font size in pixels
    tooltipFontSize: 14,

    // String - Tooltip font weight style
    tooltipFontStyle: 'normal',

    // String - Tooltip label font colour
    tooltipFontColor: '#fff',

    // String - Tooltip title font declaration for the scale label
    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip title font size in pixels
    tooltipTitleFontSize: 14,

    // String - Tooltip title font weight style
    tooltipTitleFontStyle: 'bold',

    // String - Tooltip title font colour
    tooltipTitleFontColor: '#fff',

    // Number - pixel width of padding around tooltip text
    tooltipYPadding: 6,

    // Number - pixel width of padding around tooltip text
    tooltipXPadding: 6,

    // Number - Size of the caret on the tooltip
    tooltipCaretSize: 8,

    // Number - Pixel radius of the tooltip border
    tooltipCornerRadius: 6,

    // Number - Pixel offset from point x to tooltip edge
    tooltipXOffset: 10,

    // tooltipTemplate can be a function as well (not in the docs, see Chart.Core.js in their repo)
    tooltipTemplate: function tooltipTemplate(valuesObject) {
      // Use the formatter on the chart view, otherwise default to label: value
      var view = App.getPrimaryActiveView();
      var results = undefined;
      if (view && view.formatter) {
        results = view.formatter(valuesObject.value);
      } else {
        results = valuesObject.value;
      }

      return [valuesObject.label, results].join(': ');
    },
    // String - Template string for single tooltips
    multiTooltipTemplate: '<%= value %>',

    // Function - Will fire on animation progression.
    onAnimationProgress: function onAnimationProgress() {},

    // Function - Will fire on animation completion.
    onAnimationComplete: function onAnimationComplete() {}
  });

  var mixinName = 'crm.Views.Charts._ChartMixin';

  var __class = (0, _declare['default'])('crm.Views.Charts._ChartMixin', [_PullToRefreshMixin2['default']], {
    _handle: null,
    _feedData: null,

    /**
     * @property {Number} RENDER_DELAY
     * Number The re-render delay in milliseconds when the user changes device orientation.
     */
    RENDER_DELAY: (0, _has['default'])('ios') < 8 ? 500 : 1, // Work around IOS7 orientation change issues

    /**
     * @property {Object} parent
     * Reference to the metric widget that opened this view.
     */
    parent: null,

    formatter: function formatter(val) {
      return val;
    },

    PAGE_SIZE: 100,

    /**
     * @property {String}
     * The loading text font style
     */
    loadingFont: '#000',

    /**
     * @property {String}
     * Loading message
     */
    loadingText: 'loading...',

    /**
     * Overrides View widgetTemplate
     */
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" title="{%= $.titleText %}" class="list list-hide-search {%= $.cls %}">', '<div class="overthrow scroller" data-dojo-attach-point="scrollerNode">', '<div class="legend" data-dojo-attach-point="legendNode" data-dojo-attach-event="click: onLegendClick"></div>', '<canvas class="chart-content" data-dojo-attach-point="contentNode"></canvas>', '</div>', '</div>']),

    postCreate: function postCreate() {
      this.initPullToRefresh(this.scrollerNode);
    },
    onTransitionTo: function onTransitionTo() {
      this._handle = _connect['default'].subscribe('/app/setOrientation', this, function orientationChange() {
        setTimeout((function onTimeOut() {
          if (this._feedData) {
            this.createChart(this._feedData);
          }
        }).bind(this), this.RENDER_DELAY);
      });
    },
    onTransitionAway: function onTransitionAway() {
      _connect['default'].unsubscribe(this._handle);
      this._feedData = null;
      this.parent = null;

      if (this.chart && this.chart.destroy) {
        this.chart.destroy();
      }
    },
    _setCanvasWidth: function _setCanvasWidth() {
      var box = _domGeo['default'].getMarginBox(this.domNode);
      if (this.contentNode) {
        this.contentNode.width = box.w;
      }
    },
    _drawLoading: function _drawLoading() {
      var node = this.contentNode;
      var globalConfig = window.Chart.defaults.global;
      var context = node && node.getContext && node.getContext('2d');

      if (!context) {
        return;
      }

      context.clearRect(0, 0, node.width, node.height);

      var mixin = _lang['default'].getObject(mixinName);
      var text = undefined;
      if (mixin) {
        text = mixin.prototype.loadingText;
      } else {
        text = this.loadingText;
      }

      context.fillStyle = this.loadingFont;
      context.font = globalConfig.tooltipFontSize + 'px ' + globalConfig.tooltipFontFamily;

      // Center the text
      var offset = Math.floor(context.measureText(text).width / 2);
      var x = Math.floor(node.width / 2) - offset;
      var y = 20; // padding
      context.fillText(text, x, y, node.width);
    },
    createChart: function createChart(feedData) {
      this._feedData = feedData;
    },
    getTag: function getTag() {
      return this.options && this.options.returnTo;
    },

    getSearchExpression: function getSearchExpression() {
      return this.options && this.options.currentSearchExpression;
    },

    showSearchExpression: function showSearchExpression() {
      var app = this.app || window.App;
      app.setPrimaryTitle([this.title, this.getSearchExpression()].join(': '));
    },

    /**
     * Handles click events for the legend node. Handles opening the tooltips on the chart
     * when the item in the legend is clicked. The current legend format is as follows:
     * @since 3.3
     *
     *    @example
     *    `<div class="legend" data-dojo-attach-point="legendNode">
     *        <ul class="doughnut-legend">
     *            <li data-segment="0"><span style="background-color: someColor"></span>
     *                Tooltip Label
     *            </li>
     *        </ul>
     *    </div>`
     */
    onLegendClick: function onLegendClick(evt) {
      if (!evt || !evt.srcElement || evt.srcElement === this.legendNode || !this.chart) {
        return;
      }

      var src = evt.srcElement.tagName === 'SPAN' ? evt.srcElement.parentElement : evt.srcElement;
      var segment = parseInt(src.dataset.segment, 10);
      if (segment >= 0 && this.chart.showTooltip && this.chart.segments) {
        this.chart.showTooltip(this.chart.segments.slice(segment, segment + 1), false /* re-draw flag */);
      }
    },

    /**
     * Render a legend from the chart into the legendNode attach point.
     * @since 3.3
     */
    showLegend: function showLegend() {
      if (!this.chart || !this.chart.generateLegend || !this.legendNode) {
        return;
      }

      var html = this.chart.generateLegend();
      _domAttr['default'].set(this.legendNode, {
        innerHTML: html
      });
    },

    /**
     * @deprecated 3.3
     * Charts in 3.3 no longer use the search expression node.
     */
    getSearchExpressionHeight: function getSearchExpressionHeight() {
      var box = _domGeo['default'].getMarginBox(this.searchExpressionNode);
      return box.h;
    },

    onPullToRefreshComplete: function onPullToRefreshComplete() {
      this.requestData();
    },
    refresh: function refresh() {
      this.requestData();
    },
    _getStoreAttr: function _getStoreAttr() {
      return this.createStore();
    },
    /**
     * Return a store that is consumed by requestData.
     * @since 3.3
     */
    createStore: function createStore() {
      var store = this.parent && this.parent.store;
      return store;
    },

    /**
     * Overrides _ListBase requestData to re-render the chart on pull to refresh.
     * @since 3.3
     */
    requestData: function requestData() {
      var store = this.get('store');
      if (this.chart && this.chart.destroy) {
        this.chart.destroy();
      }

      this._setCanvasWidth();
      this._drawLoading();

      if (store) {
        store.query(null, {
          start: 0,
          count: this.PAGE_SIZE
        }).then((function createChartWithData(data) {
          this.createChart(data);
        }).bind(this), function queryError(e) {
          console.error(e); // eslint-disable-line
        });
      }
    }
  });

  _lang['default'].setObject('Mobile.SalesLogix.Views.Charts._ChartMixin', __class);
  module.exports = __class;
});
