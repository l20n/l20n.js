import { MessageContext } from 'fluent';

import Localization from '../../lib/localization';
import DOMLocalization from '../../bindings/dom_localization';
import DocumentLocalization from '../../bindings/document_localization';
import { getResourceLinks } from '../web/util';
import { ResourceBundle } from './io';

window.L20n = {
  Localization,
  DOMLocalization,
  DocumentLocalization,
  getResourceLinks,
  ResourceBundle,
  MessageContext
};
