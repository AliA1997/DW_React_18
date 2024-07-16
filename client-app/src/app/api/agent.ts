import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { PaginatedResult } from "../models/pagination";
import { Profile } from "../models/profile";
import {
  User,
  UserCardDTO,
  UserChangePassword,
  UserFormValues,
  UserLogin,
} from "../models/user";
import { store } from "../stores/store";
import i18n from "../common/i18n/i18n";
import { DropdownItemProps } from "semantic-ui-react";
import { CreateCustomerFormValues, Customer, CustomerDetails, UpdateCustomerDTO } from '../models/customer';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token) config.headers!.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResult(
        response.data,
        JSON.parse(pagination)
      );
      return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      // Network error
      toast.error("Network error occurred");
      return Promise.reject(error);
    }

    const { data, status, config, headers } = error.response!;
    const dataAsAny = data as any;
    switch (status) {
      case 400:
        if (config.method === "get" && dataAsAny.errors) {
          history.push("/not-found");
        }
        if (data && dataAsAny.errors) {
          console.log("testing 400 error handler");
          console.log(dataAsAny.errors);

          const modalStateErrors = [];
          for (const key in dataAsAny.errors) {
            if (dataAsAny.errors[key]) {
              modalStateErrors.push(dataAsAny.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        } else {
          toast.error(dataAsAny);
        }
        break;
      case 401:
        if (
          status === 401 &&
          headers["www-authenticate"]?.startsWith(
            'Bearer error="invalid_token"'
          )
        ) {
          store.userStore.logout();
          //TODO fix toast translation
          toast.error(i18n.t("expired_session", { ns: "errors" }));
          //toast.error('Session expired - please login again');
        }
        break;
      case 404:
        history.push("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(dataAsAny);
        history.push("/server-error");
        break;
      default:
        store.commonStore.setServerError(status + dataAsAny);
        history.push("/server-error");
        break;
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Account = {
  current: () => requests.get<User>("/account"),
  login: (user: UserLogin) => requests.post<User>("/account/login", user),
  register: (user: UserFormValues) =>
    requests.post<User>("/account/register", user),
  internalClientId: () => requests.get<string>("/client/internalclient"),
  fbLogin: (accessToken: string) =>
    requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`, {}),
  refreshToken: () => requests.post<User>("/account/refreshToken", {}),
  verifyEmail: (token: string, email: string) =>
    requests.post<void>(
      `/account/verifyEmail?token=${token}&email=${email}`,
      {}
    ),
  resendEmailConfirm: (email: string) =>
    requests.get(`/account/resendEmailConfirmationLink?email=${email}`),
  changePassword: (user: UserChangePassword) =>
    requests.post<void>("/account/changepassword", user),
  userList: () => requests.get<UserCardDTO[]>("/ApplicationUsers/listusers"),
  roleList: () => requests.get<DropdownItemProps[]>("/UserRole/Rolelist"),
};

const UserRoles = {};

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.del(`/photos/${id}`),
  updateProfile: (profile: Partial<Profile>) =>
    requests.put(`/profiles`, profile),
  updateFollowing: (username: string) =>
    requests.post(`/follow/${username}`, {}),
  listFollowings: (username: string, predicate: string) =>
    requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
};

const Customers = {
  getAll: () =>
    requests.get<CustomerDetails[]>(`/Customer?pageNumber=1&pageSize=20`),
  getById: (customerId: string) =>
    requests.get<CustomerDetails>(`/Customer/${customerId}`),
  delete: (customerId: string) =>
    requests.del<void>(`/Customer/${customerId}`),
  create: (customer: CreateCustomerFormValues) =>
    requests.post<Customer>("/Customer", customer),
  update: (customerId: string, customer: UpdateCustomerDTO) =>
    requests.put<Customer>(`/Customer/${customerId}`, customer),
};

const agent = {
  Account,
  Customers,
  Profiles,
  UserRoles,
};

export default agent;
