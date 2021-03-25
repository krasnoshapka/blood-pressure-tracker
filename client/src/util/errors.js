
const processErrors = (_errors) => {
  const res = _errors ? {} : null;
  if (_errors && _errors.graphQLErrors) {
    _errors.graphQLErrors.forEach((er) => {
      res[er.extensions.argumentName ?? 'message'] = er.message;
    });
  }
  return res;
}

export {processErrors};
