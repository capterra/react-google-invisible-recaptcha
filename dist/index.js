'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var renderers = [];

var injectScript = function injectScript(locale, sitekeyV3) {
  window.GoogleRecaptchaLoaded = function () {
    while (renderers.length) {
      var renderer = renderers.shift();
      renderer();
    }
  };

  var srcRenderValue = sitekeyV3 || 'explicit';
  var script = document.createElement('script');
  script.id = 'recaptcha';
  script.src = 'https://www.google.com/recaptcha/api.js?hl=' + locale + '&onload=GoogleRecaptchaLoaded&render=' + srcRenderValue;
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.onerror = function (error) {
    throw error;
  };
  document.body.appendChild(script);
};

var GoogleRecaptcha = function (_React$Component) {
  _inherits(GoogleRecaptcha, _React$Component);

  function GoogleRecaptcha() {
    _classCallCheck(this, GoogleRecaptcha);

    return _possibleConstructorReturn(this, (GoogleRecaptcha.__proto__ || Object.getPrototypeOf(GoogleRecaptcha)).apply(this, arguments));
  }

  _createClass(GoogleRecaptcha, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          sitekey = _props.sitekey,
          locale = _props.locale,
          badge = _props.badge,
          onResolved = _props.onResolved,
          onLoaded = _props.onLoaded,
          sitekeyV3 = _props.sitekeyV3,
          action = _props.action;


      this.callbackName = 'GoogleRecaptchaResolved-' + (0, _v2.default)();
      window[this.callbackName] = onResolved;

      var loaded = function loaded() {
        if (_this2.container) {
          var recaptchaId = window.grecaptcha.render(_this2.container, {
            sitekey: sitekey,
            size: 'invisible',
            badge: badge,
            callback: _this2.callbackName
          });
          _this2.execute = function () {
            return window.grecaptcha.execute(recaptchaId);
          };
          _this2.reset = function () {
            return window.grecaptcha.reset(recaptchaId);
          };
          _this2.getResponse = function () {
            return window.grecaptcha.getResponse(recaptchaId);
          };
          if (sitekeyV3) {
            _this2.executeV3 = function () {
              return window.grecaptcha.execute(sitekeyV3, { action: action });
            };
          }
          onLoaded();
        }
      };

      if (window.grecaptcha && window.grecaptcha.render && window.grecaptcha.execute && window.grecaptcha.reset && window.grecaptcha.getResponse) {
        loaded();
      } else {
        renderers.push(loaded);
        injectScript(locale, sitekeyV3);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      delete window[this.callbackName];
      delete this.container;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var style = this.props.style;

      return _react2.default.createElement('div', { ref: function ref(_ref) {
          return _this3.container = _ref;
        }, style: style });
    }
  }]);

  return GoogleRecaptcha;
}(_react2.default.Component);

GoogleRecaptcha.propTypes = {
  sitekey: _propTypes2.default.string.isRequired,
  sitekeyV3: _propTypes2.default.string,
  action: _propTypes2.default.string,
  locale: _propTypes2.default.string,
  badge: _propTypes2.default.oneOf(['bottomright', 'bottomleft', 'inline']),
  onResolved: _propTypes2.default.func.isRequired,
  onLoaded: _propTypes2.default.func,
  style: _propTypes2.default.object
};

GoogleRecaptcha.defaultProps = {
  locale: 'en',
  badge: 'bottomright',
  onLoaded: function onLoaded() {},
  sitekeyV3: null,
  action: 'homepage'
};

exports.default = GoogleRecaptcha;