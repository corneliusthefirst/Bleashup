import stores from "../stores";

class UserInfoDispach {
    saveNewContact(contact){
        return stores.Contacts.addContact(contact)
    }
    removeContact(phone){
        return stores.Contacts.removeContact(phone)
    }
    updateContactUserInfo(phone,info){
        return stores.TemporalUsersStore.updateUserInfo(phone,Object.keys(info)[0],Object.values(info)[0])
    }
}
const UserInfoDispatcher = new UserInfoDispach()
export default UserInfoDispatcher