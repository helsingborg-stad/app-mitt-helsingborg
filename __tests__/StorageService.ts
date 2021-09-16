import StorageService from '../source/services/StorageService';

describe('StorageService', () => {
  it('stores and fetches data', async () => {
    const mockKey = '___jest_mockKey';
    const mockValue = {
      test: 'Hello World',
    };
    await StorageService.saveData(mockKey, JSON.stringify(mockValue));
    const retrievedDataRaw = await StorageService.getData(mockKey);

    expect(retrievedDataRaw).toBeDefined();

    const retrievedData: typeof mockValue = JSON.parse(retrievedDataRaw);

    expect(retrievedData.test).toEqual('Hello World');
  });

  it('clears data', async () => {
    const mockKey = '___jest_mockKey';

    await StorageService.saveData(mockKey, JSON.stringify({ hello: 'world' }));
    await StorageService.clearData();
    const retrievedData = await StorageService.getData(mockKey);

    expect(retrievedData).toBeNull();
  });
});
