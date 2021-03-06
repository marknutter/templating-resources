System.register(['aurelia-dependency-injection', 'aurelia-binding'], function (_export) {
  'use strict';

  var inject, transient, ObserverLocator, createOverrideContext, CollectionStrategy;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
      transient = _aureliaDependencyInjection.transient;
    }, function (_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
      createOverrideContext = _aureliaBinding.createOverrideContext;
    }],
    execute: function () {
      CollectionStrategy = (function () {
        function CollectionStrategy(observerLocator) {
          _classCallCheck(this, _CollectionStrategy);

          this.observerLocator = observerLocator;
        }

        CollectionStrategy.prototype.initialize = function initialize(repeat, bindingContext, overrideContext) {
          this.viewFactory = repeat.viewFactory;
          this.viewSlot = repeat.viewSlot;
          this.items = repeat.items;
          this.local = repeat.local;
          this.key = repeat.key;
          this.value = repeat.value;
          this.bindingContext = bindingContext;
          this.overrideContext = overrideContext;
        };

        CollectionStrategy.prototype.dispose = function dispose() {
          this.viewFactory = null;
          this.viewSlot = null;
          this.items = null;
          this.local = null;
          this.key = null;
          this.value = null;
          this.bindingContext = null;
          this.overrideContext = null;
        };

        CollectionStrategy.prototype.updateOverrideContexts = function updateOverrideContexts(startIndex) {
          var children = this.viewSlot.children;
          var length = children.length;

          if (startIndex > 0) {
            startIndex = startIndex - 1;
          }

          for (; startIndex < length; ++startIndex) {
            this.updateOverrideContext(children[startIndex].overrideContext, startIndex, length);
          }
        };

        CollectionStrategy.prototype.createFullOverrideContext = function createFullOverrideContext(data, index, length, key) {
          var context = this.createBaseOverrideContext(data, key);
          return this.updateOverrideContext(context, index, length);
        };

        CollectionStrategy.prototype.createBaseOverrideContext = function createBaseOverrideContext(data, key) {
          var context = createOverrideContext(undefined, this.overrideContext);

          if (typeof key !== 'undefined') {
            context[this.key] = key;
            context[this.value] = data;
          } else {
            context[this.local] = data;
          }

          return context;
        };

        CollectionStrategy.prototype.updateOverrideContext = function updateOverrideContext(context, index, length) {
          var first = index === 0;
          var last = index === length - 1;
          var even = index % 2 === 0;

          context.$index = index;
          context.$first = first;
          context.$last = last;
          context.$middle = !(first || last);
          context.$odd = !even;
          context.$even = even;

          return context;
        };

        var _CollectionStrategy = CollectionStrategy;
        CollectionStrategy = transient()(CollectionStrategy) || CollectionStrategy;
        CollectionStrategy = inject(ObserverLocator)(CollectionStrategy) || CollectionStrategy;
        return CollectionStrategy;
      })();

      _export('CollectionStrategy', CollectionStrategy);
    }
  };
});