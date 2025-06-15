const saveToken = (accountId: string, privateKey: string) => {
  localStorage.setItem('accountId', accountId)
  localStorage.setItem('privateKey', privateKey)
} 
const getToken = () => {
  const storedAccountId = localStorage.getItem('accountId')
  const storedPrivateKey = localStorage.getItem('privateKey')

  return {storedAccountId, storedPrivateKey}
} 

const localSotageServices = {
  saveToken,
  getToken,
};

export default localSotageServices;