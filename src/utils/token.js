export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  return localStorage.removeItem('token');
};

export const setBranch = (branchId) => {
  console.log('Setting branch id ', branchId);
  localStorage.setItem('branchId', branchId);
};

export const getBranch = () => {
  const branchId = localStorage.getItem('branchId');
  console.log(
    'Fetching branch id ',
    branchId ?? '5fc8fbbb-c0b0-410e-a571-ccf1129b523b'
  );
  return branchId ?? '5fc8fbbb-c0b0-410e-a571-ccf1129b523b';
};

export const removeBranch = () => {
  console.log('Removing branch ID', localStorage.removeItem('branchId'));
  return localStorage.removeItem('branchId');
};
