import {
  InitialStateType,
  appReducer,
  setAppErrorAC,
  setAppStatusAC,
} from "./app-reducer";

let startState: InitialStateType;

beforeEach(() => {
  startState = {
    status: "idle",
    error: null,
    isInitialized: false,
  };
});

test("correct error message should be set", () => {
  const endState = appReducer(startState, setAppErrorAC("some error"));
  expect(endState.error).toBe("some error");
});

test("correct status message should be set", () => {
  const endState = appReducer(startState, setAppStatusAC("failed"));
  expect(endState.status).toBe("failed");
});
