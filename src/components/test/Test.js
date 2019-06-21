import _ from 'lodash';
import BaseComponent from '../base/Base';
import { flattenComponents } from '../../utils/utils';

export default class TestComponent extends BaseComponent {
  static schema(...extend) {
    return BaseComponent.schema({
      type: 'test',
      label: 'test',
      // color:'red',
      key: 'test',
      size: 'md',
      leftIcon: '',
      rightIcon: '',
      block: false,
      action: 'submit',
      persistent: false,
      disableOnInvalid: false,
      theme: 'default',
      dataGridLabel: true
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: '测试',
      group: 'newGroup',
      icon: 'fa fa-stop',
      documentation: 'http://help.form.io/userguide/#button',
      weight: 110,
      schema: TestComponent.schema()
    };
  }

  get defaultSchema() {
    return TestComponent.schema();
  }

  elementInfo() {
    const info = super.elementInfo();
    info.type = 'input';
    if (this.component.hasOwnProperty('spellcheck')) {
      info.attr.spellcheck = this.component.spellcheck;
    }

    if (this.component.mask) {
      info.attr.type = 'password';
    }
    else {
      info.attr.type = 'text';
    }
    info.changeEvent = 'input';
    return info;
  }

  set loading(loading) {
    this.setLoading(this.buttonElement, loading);
  }

  set disabled(disabled) {
    // Do not allow a component to be disabled if it should be always...
    if ((!disabled && this.shouldDisable) || (disabled && !this.shouldDisable)) {
      return;
    }
    super.disabled = disabled;
    this.setDisabled(this.buttonElement, disabled);
  }

  // No label needed for buttons.

  createInput(container) {
    this.buttonElement = super.createInput(container);
    return this.buttonElement;
  }

  get emptyValue() {
    return false;
  }

  getValue() {
    return this.dataValue;
  }

  get clicked() {
    return this.dataValue;
  }

  get defaultValue() {
    return false;
  }

  set dataValue(value) {
    if (!this.component.input) {
      return;
    }
    super.dataValue = value;
  }

  get className() {
    let className = super.className;
    className += ' form-group';
    return className;
  }

  buttonMessage(message) {
    return this.ce('span', { class: 'help-block' }, this.text(message));
  }

  /* eslint-disable max-statements */
  build() {
    super.build()

    this.autofocus();
    this.attachLogic();
  }
  /* eslint-enable max-statements */

  openOauth() {
    if (!this.root.formio) {
      console.warn('You must attach a Form API url to your form in order to use OAuth buttons.');
      return;
    }

    const settings = this.component.oauth;

    /*eslint-disable camelcase */
    let params = {
      response_type: 'code',
      client_id: settings.clientId,
      redirect_uri: window.location.origin || `${window.location.protocol}//${window.location.host}`,
      state: settings.state,
      scope: settings.scope
    };
    /*eslint-enable camelcase */

    // Make display optional.
    if (settings.display) {
      params.display = settings.display;
    }

    params = Object.keys(params).map(key => {
      return `${key}=${encodeURIComponent(params[key])}`;
    }).join('&');

    const url = `${settings.authURI}?${params}`;
    const popup = window.open(url, settings.provider, 'width=1020,height=618');

    const interval = setInterval(() => {
      try {
        const popupHost = popup.location.host;
        const currentHost = window.location.host;
        if (popup && !popup.closed && popupHost === currentHost && popup.location.search) {
          popup.close();
          const params = popup.location.search.substr(1).split('&').reduce((params, param) => {
            const split = param.split('=');
            params[split[0]] = split[1];
            return params;
          }, {});
          if (params.error) {
            alert(params.error_description || params.error);
            this.root.setAlert('danger', params.error_description || params.error);
            return;
          }
          // TODO: check for error response here
          if (settings.state !== params.state) {
            this.root.setAlert('danger', 'OAuth state does not match. Please try logging in again.');
            return;
          }
          const submission = { data: {}, oauth: {} };
          submission.oauth[settings.provider] = params;
          submission.oauth[settings.provider].redirectURI = window.location.origin
            || `${window.location.protocol}//${window.location.host}`;
          this.root.formio.saveSubmission(submission)
            .then((result) => {
              this.root.onSubmit(result, true);
            })
            .catch((err) => {
              this.root.onSubmissionError(err);
            });
        }
      }
      catch (error) {
        if (error.name !== 'SecurityError') {
          this.root.setAlert('danger', error.message || error);
        }
      }
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(interval);
      }
    }, 100);
  }

  destroy() {
    super.destroy();
    this.removeShortcut(this.buttonElement);
  }

  focus() {
    this.buttonElement.focus();
  }

  triggerReCaptcha() {
    let recaptchaComponent;
    this.root.everyComponent((component) => {
      if (component.component.type === 'recaptcha' &&
        component.component.eventType === 'buttonClick' &&
        component.component.buttonKey === this.component.key) {
        recaptchaComponent = component;
        return false;
      }
    });
    if (recaptchaComponent) {
      recaptchaComponent.verify(`${this.component.key}Click`);
    }
  }
}
