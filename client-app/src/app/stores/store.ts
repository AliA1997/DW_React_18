import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import UserStore from "./userStore";
import CustomerStore from "./customersStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    customerStore: CustomerStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    customerStore: new CustomerStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}