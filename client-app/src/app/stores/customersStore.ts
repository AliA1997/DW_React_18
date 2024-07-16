import { makeAutoObservable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../api/agent";
import { store } from "./store";
import i18n from "../common/i18n/i18n";
import { DropdownItemProps } from "semantic-ui-react";
import {
  CreateCustomerFormValues,
  Customer,
  CustomerDetails,
  UpdateCustomerDTO,
} from "../models/customer";

export default class CustomerStore {
  loadingInitial: boolean = false;
  customerToUpdate: CustomerDetails | undefined = undefined;
  allCustomers: CustomerDetails[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getCustomers = async () => {
    this.loadingInitial = true;
    try {
      const customers = await this.getCustomersEffect();
      runInAction(() => {
        this.loadingInitial = false;
      });
      this.allCustomers = customers;
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });
      throw error;
    }
  };

  getCustomerById = async (customerId: string) => {
    this.loadingInitial = true;
    try {
      const customer = await this.getCustomerByIdEffect(customerId);
      runInAction(() => {
        this.loadingInitial = false;
      });
      if(customer) 
        this.customerToUpdate = customer;

    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });
      throw error;
    }
  };

  createCustomer = async (newCustomer: CreateCustomerFormValues) => {
    try {
      await this.createCustomerEffect(newCustomer);
      const updatedCustomers = await this.getCustomersEffect();
      this.allCustomers = updatedCustomers;
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  updateCustomer = async (customerId: string, updatedCustomer: UpdateCustomerDTO) => {
    this.loadingInitial = true;
    try {
      await this.updateCustomerEffect(customerId, updatedCustomer);
      const updatedCustomers = await this.getCustomersEffect();
      this.allCustomers = updatedCustomers;
      store.modalStore.closeModal();
      runInAction(() => {
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });
      throw error;
    }
  };

  deleteCustomer = async (customerId: string) => {
    this.loadingInitial = true;
    try {
      await this.deleteCustomerEffect(customerId);
      const copyOfAllCustomers = this.allCustomers.slice();
      const indexOfDeletedCustomer = copyOfAllCustomers.findIndex(
        (c) => c.id === customerId
      );
      copyOfAllCustomers.splice(indexOfDeletedCustomer, 1);
      this.allCustomers = copyOfAllCustomers;
      runInAction(() => {
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });
      throw error;
    }
  };

  private getCustomersEffect = async () => {
    return await agent.Customers.getAll();
  };

  private getCustomerByIdEffect = async (customerId: string) => {
    return await agent.Customers.getById(customerId);
  }
  private createCustomerEffect = async (
    newCustomer: CreateCustomerFormValues
  ) => {
    await agent.Customers.create(newCustomer);
  };

  private updateCustomerEffect = async (customerId: string, updatedCustomer: UpdateCustomerDTO) => {
    await agent.Customers.update(customerId, updatedCustomer);
  };

  private deleteCustomerEffect = async (customerId: string) => {
    await agent.Customers.delete(customerId);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };
}
