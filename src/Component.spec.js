import Component from './Component';
import assert from 'power-assert';

describe('Component', () => {
  // Allowed space characters between classes are SPACE, TAB, LF, FF, CR.
  // (see https://www.w3.org/TR/2011/WD-html5-20110525/elements.html#classes)
  const spaceCharacters = /[ \t\n\f\r]+/;

  let component;
  let element;

  beforeEach(() => {
    component = new Component();
    element = component.ce('div', null);
  });

  it('Should create new elements with empty class attribute', () => {
    assert(!element.getAttribute('class'));
  });

  it('Should add class to element', () => {
    component.addClass(element, 'Test.js');
    const classes = element.getAttribute('class').split(spaceCharacters);
    assert(classes.length === 1);
    assert(classes.includes('Test.js'));
  });

  it('Should not add existing class to element twice', () => {
    component.addClass(element, 'Test.js');
    component.addClass(element, 'Test.js');
    const classes = element.getAttribute('class').split(spaceCharacters);
    assert(classes.length === 1);
    assert(classes.includes('Test.js'));
  });

  it('Should add class to element, even if it is a substring of existing class', () => {
    component.addClass(element, 'test-a');
    component.addClass(element, 'Test.js');
    const classes = element.getAttribute('class').split(spaceCharacters);
    assert(classes.length === 2);
    assert(classes.includes('Test.js'));
    assert(classes.includes('test-a'));
  });

  it('Should remove class from element, even if it is a substring of other classes', () => {
    component.addClass(element, 'test-a');
    component.addClass(element, 'Test.js');
    component.addClass(element, 'test-b');
    component.removeClass(element, 'Test.js');
    const classes = element.getAttribute('class').split(spaceCharacters);
    assert(classes.length === 2);
    assert(classes.includes('test-a'));
    assert(classes.includes('test-b'));
  });

  it('Should report existing class', () => {
    component.addClass(element, 'Test.js');
    assert(component.hasClass(element, 'Test.js'));
  });

  it('Should report non-existing class', () => {
    component.addClass(element, 'test-a');
    assert(!component.hasClass(element, 'Test.js'));
  });

  it('Should handle space characters SPACE, TAB, LF, FF and CR between classes', () => {
    element.setAttribute('class', 'test-a\t\ntest\f\rtest-b');
    component.removeClass(element, 'Test.js');
    const classes = element.getAttribute('class').split(spaceCharacters);
    assert(classes.length === 2);
    assert(classes.includes('test-a'));
    assert(classes.includes('test-b'));
  });

  it('Should remove class at beginning of list', () => {
    element.setAttribute('class', 'test\ttest-b');
    component.removeClass(element, 'Test.js');
    const classes = element.getAttribute('class').split(spaceCharacters);
    assert(classes.length === 1);
    assert(classes.includes('test-b'));
  });

  it('Should remove class at end of list', () => {
    element.setAttribute('class', 'test-a\ttest');
    component.removeClass(element, 'Test.js');
    const classes = element.getAttribute('class').split(spaceCharacters);
    assert(classes.length === 1);
    assert(classes.includes('test-a'));
  });
});
