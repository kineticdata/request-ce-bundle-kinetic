import { checkHeaderToFieldMap } from './DatastoreImport';

describe('checkHeaderToFieldMap function', () => {
  describe('config, form and csv headers have not changed', () => {
    const formFields = ['a', 'b', 'c'];
    const headers = ['a', 'b', 'c'];
    const headerMap = [
      { header: 'a', field: 'a' },
      { header: 'b', field: 'b' },
      { header: 'c', field: 'c' },
    ];
    const result = checkHeaderToFieldMap(headers, headerMap, formFields);

    test('results match headerMap', () => {
      expect(result.headerToFieldMap.toJS()).toEqual(headerMap);
    });
    test('results recordsHeaders equals headers', () => {
      expect(result.recordsHeaders.toJS()).toEqual(headers);
    });
    test('results missingFields is empty', () => {
      expect(result.missingFields.toJS()).toEqual([]);
    });
    test('results should have missingFields', () => {
      const map = [
        { header: 'a', field: '' },
        { header: 'b', field: 'b' },
        { header: 'c', field: 'c' },
      ];
      const res = checkHeaderToFieldMap(headers, map, formFields);
      expect(res.missingFields.toJS()).toEqual(['a']);
    });
  });
  describe('config has headers that csv does not', () => {
    const formFields = ['a', 'b', 'c'];
    const headerMap = [
      { header: 'a', field: 'a' },
      { header: 'b', field: 'b' },
      { header: 'c', field: 'c' },
    ];
    test('headerToFieldMap should have one less obj than headerMap', () => {
      const headers = ['b', 'c'];
      const result = checkHeaderToFieldMap(headers, headerMap, formFields);
      expect(result.headerToFieldMap.size).toBe(headerMap.length - 1);
    });
    test('headerToFieldMap should have two less obj than headerMap', () => {
      const headers = ['b'];
      const result = checkHeaderToFieldMap(headers, headerMap, formFields);
      expect(result.headerToFieldMap.size).toBe(headerMap.length - 2);
    });
  });
  describe('csv has headers that config does not', () => {
    const formFields = ['a', 'b', 'c', 'd'];
    const headerMap = [
      { header: 'a', field: 'a' },
      { header: 'b', field: 'b' },
      { header: 'c', field: 'c' },
    ];
    test('headerToFieldMap should have one more obj than headerMap', () => {
      const headers = ['a', 'b', 'c', 'd'];
      const result = checkHeaderToFieldMap(headers, headerMap, formFields);
      expect(result.headerToFieldMap.size).toBe(headerMap.length + 1);
    });
    test('headerToFieldMap should have two more obj than headerMap', () => {
      const headers = ['a', 'b', 'c', 'd', 'f'];
      const result = checkHeaderToFieldMap(headers, headerMap, formFields);
      expect(result.headerToFieldMap.size).toBe(headerMap.length + 2);
    });
  });
  describe('config has fields that form does not', () => {
    const headers = ['a', 'b', 'c'];
    const headerMap = [
      { header: 'a', field: 'a' },
      { header: 'b', field: 'b' },
      { header: 'c', field: 'c' },
    ];
    test('object in headerToFieldMap with header a should have blank field value', () => {
      const formFields = ['b', 'c'];
      const result = checkHeaderToFieldMap(headers, headerMap, formFields);
      expect(
        result.headerToFieldMap.find(obj => obj.header === 'a').field === '',
      ).toBe(true);
    });
    test('objects in headerToFieldMap with header a, c should have blank field value', () => {
      const formFields = ['b'];
      const result = checkHeaderToFieldMap(headers, headerMap, formFields);
      expect(
        result.headerToFieldMap.find(obj => obj.header === 'a').field === '',
      ).toBe(true);
      expect(
        result.headerToFieldMap.find(obj => obj.header === 'c').field === '',
      ).toBe(true);
    });
  });
});
