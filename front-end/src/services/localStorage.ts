const saveLocalSotage = (accountId: string, privateKey: string, userId: string, name:string) => {
  localStorage.setItem('accountId', accountId)
  localStorage.setItem('privateKey', privateKey)
  localStorage.setItem('userId', userId)
  localStorage.setItem('name', name)
} 
const getLocalSotage = () => {
  const storedAccountId = localStorage.getItem('accountId')
  const storedPrivateKey = localStorage.getItem('privateKey')
  const storedUserId = localStorage.getItem('userId')
  const storedName = localStorage.getItem('name')

  return {storedAccountId, storedPrivateKey, storedUserId, storedName}
} 

const localSotageServices = {
  saveLocalSotage,
  getLocalSotage,
};

export default localSotageServices;