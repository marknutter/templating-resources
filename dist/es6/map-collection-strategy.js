import {CollectionStrategy} from './collection-strategy';

export class MapCollectionStrategy extends CollectionStrategy {
  getCollectionObserver(items) {
    return this.observerLocator.getMapObserver(items);
  }

  processItems(items) {
    let viewFactory = this.viewFactory;
    let viewSlot = this.viewSlot;
    let index = 0;
    let overrideContext;
    let view;

    items.forEach((value, key) => {
      overrideContext = this.createFullOverrideContext(value, index, items.size, key);
      view = viewFactory.create();
      view.bind(undefined, overrideContext);
      viewSlot.add(view);
      ++index;
    });
  }

  handleChanges(map, records) {
    let viewSlot = this.viewSlot;
    let key;
    let i;
    let ii;
    let view;
    let overrideContext;
    let removeIndex;
    let record;
    let rmPromises = [];
    let viewOrPromise;

    for (i = 0, ii = records.length; i < ii; ++i) {
      record = records[i];
      key = record.key;
      switch (record.type) {
      case 'update':
        removeIndex = this._getViewIndexByKey(key);
        viewOrPromise = viewSlot.removeAt(removeIndex, true);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
        overrideContext = this.createFullOverrideContext(map.get(key), removeIndex, map.size, key);
        view = this.viewFactory.create();
        view.bind(undefined, overrideContext);
        viewSlot.insert(removeIndex, view);
        break;
      case 'add':
        overrideContext = this.createFullOverrideContext(map.get(key), map.size - 1, map.size, key);
        view = this.viewFactory.create();
        view.bind(undefined, overrideContext);
        viewSlot.insert(map.size - 1, view);
        break;
      case 'delete':
        if (record.oldValue === undefined) { return; }
        removeIndex = this._getViewIndexByKey(key);
        viewOrPromise = viewSlot.removeAt(removeIndex, true);
        if (viewOrPromise instanceof Promise) {
          rmPromises.push(viewOrPromise);
        }
        break;
      case 'clear':
        viewSlot.removeAll(true);
        break;
      default:
        continue;
      }
    }

    if (rmPromises.length > 0) {
      Promise.all(rmPromises).then(() => {
        this.updateOverrideContexts(0);
      });
    } else {
      this.updateOverrideContexts(0);
    }
  }

  _getViewIndexByKey(key) {
    let viewSlot = this.viewSlot;
    let i;
    let ii;
    let child;

    for (i = 0, ii = viewSlot.children.length; i < ii; ++i) {
      child = viewSlot.children[i];
      if (child.overrideContext[this.key] === key) {
        return i;
      }
    }
  }
}
