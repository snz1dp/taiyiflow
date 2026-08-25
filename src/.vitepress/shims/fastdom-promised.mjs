/**
 * ESM shim for fastdom/extensions/fastdom-promised.js
 * The original file is a UMD/IIFE with no `export default`,
 * which breaks Vite's native ESM serving in dev mode.
 */

function task(instance, type, fn, ctx) {
  const tasks = instance._tasks;
  const fastdom = instance.fastdom;
  let outerPromise;
  const promise = new Promise((resolve, reject) => {
    outerPromise = fastdom[type](() => {
      tasks.delete(outerPromise);
      try {
        resolve(ctx ? fn.call(ctx) : fn());
      } catch (e) {
        reject(e);
      }
    }, ctx);
  });
  tasks.set(outerPromise, promise);
  return promise;
}

const fastdomPromised = {
  initialize() {
    this._tasks = new Map();
  },
  mutate(fn, ctx) {
    return task(this, 'mutate', fn, ctx);
  },
  measure(fn, ctx) {
    return task(this, 'measure', fn, ctx);
  },
  clear(fn) {
    const tasks = this._tasks;
    const t = tasks.get(fn);
    this.fastdom.clear(t);
    tasks.delete(fn);
  }
};

export default fastdomPromised;
