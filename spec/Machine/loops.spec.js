/**
 * Spec for Machine
 * @author Mikhail Yurasov <mikhail@electricimp.com>
 */

'use strict';

require('jasmine-expect');
const init = require('./init')('main');
const jasmineDiffMatchers = require('jasmine-diff-matchers');

describe('Machine', () => {
  let machine;

  beforeEach(() => {
    machine = init.createMachine();
    // show string diffs
    jasmine.addMatchers(jasmineDiffMatchers.diffChars);
  });

  it('should handle @while corectly #1', () => {
    const res = machine.execute(
      `
@set a = 3
@while a > 0
loop.index == @{loop.index}
a == @{a}
@set a = a - 1
@end
`
    );

    expect(res).diffChars(
      `
loop.index == 0
a == 3
loop.index == 1
a == 2
loop.index == 2
a == 1
`
    );
  });

  it('shold handle @repeat loops correctly #1', () => {

    const res = machine.execute(
      `
@repeat 3
loop.index == @{loop.index}
loop.iteration == @{loop.iteration}
@end
`
    );

    expect(res).diffChars(
      `
loop.index == 0
loop.iteration == 1
loop.index == 1
loop.iteration == 2
loop.index == 2
loop.iteration == 3
`
    );

  });
});
