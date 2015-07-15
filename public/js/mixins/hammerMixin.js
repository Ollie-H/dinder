"use strict";
 
var Hammer = require('hammerjs');
 
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
 
function enumerateObjectKeys(obj, cb, ctx) {
  var boundCb = ctx ? cb.bind(ctx) : cb;
 
  return Object.keys(obj).forEach(function (key) {
    boundCb(key, obj[key]);
  });
}
 
var HammerMixin = {
  // no real symbols in ES5 :(
  // it should be private, out of HammerMixin object
  hammerSymbol: 'hammer',
 
  _hammerConfig: function () {
    return this[this.hammerSymbol];
  },
 
  _handlerForRecognizer: function (recognizer) {
    var handlerName = 'handle' + capitalize(recognizer)
      , handler = this[handlerName];
 
    return handler
      ? handler
      : new Error('Handler `' + handlerName + '` was not found.');
  },
 
  _addRecognizers: function () {
    enumerateObjectKeys(this._hammerConfig(), function (key, val) {
      var ref = this.refs[key]
        , recognizer = val;
 
      if (!ref) throw new Error('Ref `' + key + '` was not found.');
 
      var handler = this._handlerForRecognizer(recognizer);
 
      if (handler instanceof Error) throw handler;
 
      var hammer = new Hammer(ref.getDOMNode(), null);
      hammer.on(recognizer, handler);
 
      this._hammerInstances[key] = hammer;
    }, this);
  },
 
  _removeRecognizers: function () {
    enumerateObjectKeys(this._hammerInstances, function (key, _) {
      this._hammerInstances[key].off(this._hammerConfig()[key]);
    }, this);
  },
 
  componentDidMount: function () {
    this._hammerInstances = {};
    this._addRecognizers();
  },
 
  componentWillUnmount: function() {
    this._removeRecognizers();
    delete this._hammerInstances;
  }
};
 
module.exports = HammerMixin;