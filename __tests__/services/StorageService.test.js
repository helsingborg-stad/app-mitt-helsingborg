import StorageService, { TOKEN_KEY } from 'app/services/StorageService';

test('Save and get storage data', async () => {
  const tokenData = 'someTokenChars';

  await StorageService.saveData(TOKEN_KEY, tokenData);

  StorageService.getData(TOKEN_KEY).then(fetchedUserKey => {
    expect(fetchedUserKey).toEqual(tokenData);
  });
});
