import {replaceTagPart} from '../CaseDataConverter'

describe('replaceTagPart', () => {
  
  it('replaces part in tag on single occurence', () => {
    const input = {
      tag: 'test:example:replace',
      part: 'replace',
      value: 'success'
    }
    const output = 'test:example:success'
    expect(replaceTagPart([...input]).equal(output))
  });

  it('replaces part in tag on multiple occurences', () => {
    expect()
  });

  it('does not replace part that contains value of other part in tag', () => {
    expect()
  });

})