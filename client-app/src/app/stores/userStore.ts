import { makeAutoObservable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserCardDTO, UserChangePassword, UserFormValues, UserLogin } from "../models/user";
import { store } from "./store";
import i18n from '../common/i18n/i18n';
import { DropdownItemProps } from "semantic-ui-react";

export default class UserStore {
  user: User | null = null;
  fbAccessToken: string | null | undefined = null;
  loadingInitial = false;
  refreshTokenTimeout: any;
  clientId: string | null = null;
  userList: UserCardDTO[] = [];
  editMode: boolean = false;
  roleList: DropdownItemProps[] = [];


  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserLogin) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      runInAction(() => (this.user = user));
      //TODO need to determine the page after login from here.  pull token to check roles or pull roles from api or pull page from api
      history.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  changePassword = async (changePassword: UserChangePassword, id: string) => {
    try {
      changePassword.id = id;
      agent.Account.changePassword(changePassword);
      toast.success(i18n.t("password_update_successful"));
      history.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem("jwt");
    this.user = null;
    history.push("/");
  };

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };

  register = async (creds: UserFormValues) => {
    try {
      await this.addUser(creds);
      history.push(`/account/registerSuccess?email=${creds.email}`);
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  createUser = async (creds: UserFormValues) => {
    this.loadingInitial = true;
    try {
      await this.addUser(creds);
      runInAction(() => {
        this.userList = [];
        this.loadingInitial = false;
        })
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
        })
      throw error;
    }
  };

  private addUser = async (creds: UserFormValues) => {
    creds.isInternal = true;
      creds.application = [];
      if (!this.clientId) this.getInternalClientId();
      if (this.clientId) creds.clientId = this.clientId;
      await agent.Account.register(creds);
  }

  getInternalClientId = async () => {
    try {
      const clientId = await agent.Account.internalClientId();
      runInAction(() => (this.clientId = clientId));
    } catch (error) {
      console.log(error);
    }
  }

  requestPasswordReset = async(email: UserFormValues) => {

  };



  // setImage = (image: string) => {
  //     if (this.user) this.user.image = image;
  // }

  // setDisplayName = (name: string) => {
  //     if (this.user) this.user.displayName = name;
  // }

  getFacebookLoginStatus = async () => {
    window.FB.getLoginStatus((response) => {
      if (response.status === "connected") {
        this.fbAccessToken = response.authResponse.accessToken;
      }
    });
  };

  // facebookLogin = () => {
  //   this.loadingInitial = true;
  //   const apiLogin = (accessToken: string) => {
  //     agent.Account.fbLogin(accessToken)
  //       .then((user) => {
  //         store.commonStore.setToken(user.token);
  //         this.startRefreshTokenTimer(user);
  //         runInAction(() => {
  //           this.user = user;
  //           this.loadingInitial = false;
  //         });
  //         history.push("/tickets");
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         runInAction(() => (this.loadingInitial = false));
  //       });
  //   };
  //   if (this.fbAccessToken) {
  //     apiLogin(this.fbAccessToken);
  //   } else {
  //     window.FB.login(
  //       (response) => {
  //         apiLogin(response.authResponse.accessToken);
  //       },
  //       { scope: "public_profile,email" }
  //     );
  //   }
  // };

  refreshToken = async () => {
    this.stopRefreshTokenTimer();
    try {
      const user = await agent.Account.refreshToken();
      runInAction(() => (this.user = user));
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };

  private startRefreshTokenTimer(user: User) {
    const jwtToken = JSON.parse(atob(user.token.split(".")[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  deleteUser = async (id:string) => {
    this.loadingInitial = true;
    try{
      // await agent.User.delete(id);
      runInAction(() => {
        // this.user = [...this.user.filter(a => a.id !== id)];
        this.loadingInitial = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingInitial = false;
      })
    }
  }

  loadUsersList = async () => {
    this.loadingInitial = true;
    try {
        const result = await agent.Account.userList();
        runInAction(() => {
          this.userList = result;
          this.loadingInitial = false;
      })
    } catch (error) {
        console.log(error);
        this.loadingInitial = false;
    }
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
}

updateUser = async (creds: UserFormValues) => {
    this.loadingInitial = true;
    try {
      await agent.Account.register(creds);
      runInAction(() => {
      this.userList = [];
      this.loadingInitial = false;
      this.editMode = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingInitial = false;
      })
    }
}

loadRoleList = async () => {
  this.loadingInitial = true;
    try {
      const result = await agent.Account.roleList();
      runInAction(() => {
      this.roleList = result;
      this.loadingInitial = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingInitial = false;
      })
    }
}

}
