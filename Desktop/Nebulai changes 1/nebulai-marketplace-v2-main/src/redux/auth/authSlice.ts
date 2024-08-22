import axiosApiInstance from "@/helpers/axiosApiInstance";
import {
  createSlice,
  createAsyncThunk,
  current,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";


export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginInput) => {
    try {
      let loginApi = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`;
      if (payload?.wallet) {
        loginApi = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/evm/login`;
      }
      const result = await axios.post(loginApi, payload);
      const { status, token: accessToken } = result.data;
      if (status === "success") {
        return { status, accessToken, msg: "loggedIn" };
      }
    } catch (error: any) {
      console.log(error?.message);
      return {
        status: "error",
        msg: error?.response?.data?.message || "Something went wrong",
      };
    }
  }
);

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const accessToken = localStorage.getItem("NEB_ACC");
  if (accessToken) {
    try {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/info`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const { status, data } = result.data;
      if (status === "success") {
        return { data, accessToken } as FetchUserReturn;
      }
    } catch (error) {
    }
  }
  return null;
});

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async () => {
    const accessToken = localStorage.getItem("NEB_ACC");
    if (accessToken) {
      try {
        const result = await axiosApiInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const { status, profile, profileCompleted, walletLinked } = result.data;
        if (status === "success") {
          return { profile, profileCompleted, walletLinked };
        }
      } catch (error) {
        return null;
      }
    }
  }
);

const initState: AuthState = {
  loading: false,
  walletLoading: false,
  walletLoadingMsg: null,
  accessToken: null,
  loadingUserData: false,
  loadingUserProfile: false,
  user: null,
  userProfile: {},
  userProfileComplete: false,
  useWalletLinked: false,
  errorMsg: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      const payload: LoginInput = action.meta.arg;
      if(!payload.wallet){
        state.loading = true;
      }else{
        state.walletLoading = true;
      }
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("NEB_ACC", action.payload.accessToken);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.user = null;
      state.accessToken = null;
      state.errorMsg = "Something went wrong";
    });

    //user data
    builder.addCase(fetchUser.pending, (state) => {
      state.loadingUserData = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action?.payload?.data || null;
      state.accessToken = action?.payload?.accessToken || null;
      state.loadingUserData = false;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.user = null;
      state.accessToken = null;
      state.errorMsg = action.error.message;
      state.loadingUserData = false;
    });

    //user profile info
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loadingUserProfile = true;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.userProfile = action?.payload?.profile || null;
      state.userProfileComplete = action?.payload?.profileCompleted ?? false;
      state.useWalletLinked = action?.payload?.walletLinked ?? false;
      state.loadingUserProfile = false;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.user = null;
      state.accessToken = null;
      state.errorMsg = action.error.message;
      state.loadingUserProfile = false;
    });
  },
  reducers: {
    loginUser: (state, action: PayloadAction<{accessToken: string}>) => {
      state.accessToken = action.payload.accessToken;
    },
    logoutUser: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("NEB_ACC");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      state.user = {
        ...current(state.user),
        ...action.payload,
      };
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setWalletLoading: (state, action) => {
      state.walletLoading = action.payload;
    },
    setWalletLoadingMsg: (state, action) => {
      state.walletLoadingMsg = action.payload;
    },
    setUserWalletLinked: (state, action) => {
      state.useWalletLinked = action.payload;
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("NEB_ACC", action.payload);
    },
    addNewUserWallet: (state, action) => {
      if (state?.user) {
        state.user.linkedWallets = [...(state.user.linkedWallets ?? []), action.payload];
      }
    },
    resetAuthSlice: () => initState,
  },
});

export const {
  setLoading,
  setWalletLoading,
  setWalletLoadingMsg,
  loginUser,
  logoutUser,
  setUser,
  resetAuthSlice,
  updateUser,
  updateAccessToken,
  setUserWalletLinked,
  addNewUserWallet
  /* setUserProjects, setUserTeamMembers  */
} = authSlice.actions;

export default authSlice.reducer;
