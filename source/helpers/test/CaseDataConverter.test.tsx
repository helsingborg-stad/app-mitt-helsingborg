import { replaceTagPart } from '../CaseDataConverter';

describe('replaceTagPart', () => {
  
  it('should replace part in tag on single occurence', () => {
    const input = {
      tag: 'test:example:replace',
      part: 'replace',
      value: 'success'
    }
    const output = 'test:example:success'
    expect(replaceTagPart(input.tag, input.part, input.value)).toEqual(output)
  });

  it('should replace part at beginning of tag', () => {
    const input = {
      tag: 'replace:example:test',
      part: 'replace',
      value: 'success'
    }
    const output = 'success:example:test'
    expect(replaceTagPart(input.tag, input.part, input.value)).toEqual(output)
  });

  it('should replace part in tag on multiple occurences', () => {
    const input = {
      tag: 'test:replace:example:replace',
      part: 'replace',
      value: 'success'
    }
    const output = 'test:success:example:success'
    expect(replaceTagPart(input.tag, input.part, input.value)).toEqual(output)
  });

  it('should replace part in tag if part is only part', () => {
    const input = {
      tag: 'replace',
      part: 'replace',
      value: 'success'
    }
    const output = 'success'
    expect(replaceTagPart(input.tag, input.part, input.value)).toEqual(output)
  });

  it('should not replace part in tag if a part contains the value of another part', () => {
    const input = {
      tag: 'test:examplereplace:replace',
      part: 'replace',
      value: 'success'
    }

    const output = 'test:examplereplace:success'
    expect(replaceTagPart(input.tag, input.part, input.value)).toEqual(output)
  });

  it('should not replace any parts', () => {
    const input = {
      tag: 'test:example:other',
      part: 'replace',
      value: 'success'
    }

    const output = input.tag
    expect(replaceTagPart(input.tag, input.part, input.value)).toEqual(output)
  });

})