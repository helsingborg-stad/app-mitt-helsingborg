export default async function getException(
  func: () => Promise<unknown>
): Promise<Error | null> {
  try {
    await func();
  } catch (error) {
    return error;
  }
  return null;
}
