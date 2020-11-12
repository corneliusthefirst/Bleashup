import stores from "../../../stores";
import { concat } from 'lodash';
import { uniqBy } from 'lodash';

export default function initAllContacts(){
    if (stores.Contacts.contacts.phoneContacts &&
        stores.Contacts.contacts.phoneContacts.length > 0) {

        stores.Contacts.contacts &&
            stores.Contacts.contacts.contacts &&
            stores.Contacts.contacts.contacts.forEach((contact) => {
                if (contact.phone) {
                    let phoneUser = {
                        nickname: '',
                        phone: contact.phone,
                        profile: '',
                        status: '',
                        found: true,
                    };
                    this.phoneContacts.push(phoneUser);
                }
            });
        this.phoneContacts = concat(this.phoneContacts, stores.Contacts.contacts.phoneContacts);
        this.phoneContacts = uniqBy(this.phoneContacts, "phone")
        this.setStatePure({ isMount: true });
        this.setStatePure({ contacts: this.phoneContacts });
    }else{
        stores.Contacts.getContacts()        
        this.setStatePure({ contacts: stores.Contacts.contacts.contacts,isMount:true });
    }
}