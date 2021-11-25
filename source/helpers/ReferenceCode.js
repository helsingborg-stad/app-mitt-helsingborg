// Preliminary implementation, will be changed in prod

const getReferenceCodeForUser = (user) => {
  const num = parseInt(user.personalNumber, 10);
  const code = (num * 1337) % 100000;
  return `MH${code.toString()}`;
};

export default getReferenceCodeForUser;
