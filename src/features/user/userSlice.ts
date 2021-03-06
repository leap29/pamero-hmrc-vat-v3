import {createAsyncThunk, createSlice, isRejectedWithValue, PayloadAction} from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import {buildHMRCURL, retrieveHMRCTokens} from "./userAPI";
import {Auth} from "aws-amplify";


export interface TokenSet {
    accessToken: string;
    refreshToken: string;
    grantedScope: string;
    expiresIn: string;
}

export interface UserState {
    loggedInStatus : boolean;
    tokenStatus : 'blank' | 'valid' | 'failed' ;
  hmrcAuthURL: string;
  hmrcTokenSet : TokenSet;
}

const initialState: UserState = {
    loggedInStatus: false,
    tokenStatus: 'blank',
  hmrcAuthURL: 'Place Holder',
  hmrcTokenSet: {} as TokenSet
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const buildHMRCAuthURL = createAsyncThunk(
    'user/buildHMRCAuthURL',
    async () => {
        const response = await buildHMRCURL();
        // The value we return becomes the `fulfilled` action payload
        console.log("Worked: "+response.authCodeURL);

        return response.authCodeURL;
    }
);

export const retrieveHMRCTokenSet = createAsyncThunk(
    'user/retrieveHMRCTokenSet',
    async (authCode: string) => {
        const response = await retrieveHMRCTokens(authCode);
        // The value we return becomes the `fulfilled` action payload
        console.log("Worked: "+response.message);

        return response;
    }
);

export const performLogin = createAsyncThunk(
    'user/performLogin',
    async (params: {username: string, password: string}, { rejectWithValue }) => {
        //TODO NOTE: If you want to catch exceptions and do something special or if a valid response from an API needs
        // to be treated as an error then ensure the 2nd parameter above is a object with rejectWithValue in it and
        // then use that method to create a return object.  Whatever is returned as the value becomes the action.paylad
        // in the "rejected" handler in the extra reducer cases below.
//       try {
           console.log("About to call Auth with "+params.username+", "+params.password);
            const response = await Auth.signIn(params.username, params.password);
           //TODO Proper Login Result Logic
           // this.props.userHasAuthenticated(true);
            //this.setState({ redirect: true })
            console.log("Worked: "+response.username);

            return response.username;
//        } catch (e) {
            //TODO Proper Login Failure Logic
//            alert("Login Failed (in Thunk): "+e.message);
            //this.setState({ loading: false });
//           return rejectWithValue("Login Error");
//        }
        // The value we return becomes the `fulfilled` action payload
    }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
        .addCase(performLogin.rejected, (state, action) => {
            alert("Login Failed "+action.error.message);
            //TODO Proper Login Failure Logic
        })
        .addCase(performLogin.fulfilled, (state, action) => {
            alert("Login Passed "+action.payload);
            //TODO Proper Login Passed Logic
        })
        .addCase(buildHMRCAuthURL.pending, (state) => {
            //state.status = 'loading';
        })
        .addCase(buildHMRCAuthURL.fulfilled, (state, action) => {
            //state.status = 'idle';
            console.log(action.payload);
            console.log(action.type);
            state.hmrcAuthURL = action.payload;
            //TODO - Redirect to the auth URL somewhere sensible
            // THis is probably ok here but needs checking
            window.location.href = action.payload;
        })
        .addCase(retrieveHMRCTokenSet.fulfilled, (state, action) => {
            //TODO - need to set a proper value in the lambda function when the token generation is successful instead
            // of just setting the tokenStatus to "valid" upon any return
            state.tokenStatus = 'valid';
            console.log(action.payload.message);
            console.log(action.type);
            //TODO - We aren't returning the access tokens back - instead they are being added to the user cache / session on the server side
            // Remove the below as these should be on the server side
            state.hmrcTokenSet.accessToken = action.payload.message;
            state.hmrcTokenSet.refreshToken = action.payload.refreshToken;
            state.hmrcTokenSet.grantedScope = action.payload.grantedScope;
            state.hmrcTokenSet.expiresIn = action.payload.expiresIn;
      });
  },
});

export const {  } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectHMRCAuthURL = (state: RootState) => state.user.hmrcAuthURL;
export const selectLoggedInState = (state: RootState) => state.user.loggedInStatus;
export const selectHMRCTokenSet = (state: RootState) => state.user.hmrcTokenSet;
export const selectTokenStatus = (state: RootState) => state.user.tokenStatus;

export default userSlice.reducer;
