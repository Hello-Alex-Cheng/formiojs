import baseEditForm from '../base/Base.form';

import TestEditDisplay from './editForm/Test.edit.display';


export default function(...extend) {
  return baseEditForm([
    {
      key: 'display',
      components: TestEditDisplay
    }
  ], ...extend);
}
