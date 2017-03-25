import { MessageContext } from 'fluent';

import Localization from '../localization';
import DOMLocalization from '../dom_localization';
import DocumentLocalization from '../document_localization';
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
