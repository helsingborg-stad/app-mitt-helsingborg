// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import env from "react-native-config";

import { useAppCompabilityHook } from "./AppCompabilityContext";
import { AppProvider } from "./AppContext";

import * as getApplicationVersionStatus from "../services/ApplicationVersionService";
import VERSION_STATUS from "../types/VersionStatusTypes";

jest.mock("../services/ApplicationVersionService");

const wrapper = ({ children }: { children: JSX.Element }) => (
  <AppProvider>{children}</AppProvider>
);

const getApplicationVersionSpy = (status: VERSION_STATUS, updateUrl = "") =>
  jest.spyOn(getApplicationVersionStatus, "default").mockResolvedValueOnce({
    status,
    updateUrl,
  });

beforeEach(() => {
  jest.resetAllMocks();
});

describe("useAppCompabilityHook", () => {
  it("returns default value in `devmode`", async () => {
    expect.assertions(3);

    env.APP_ENV = "development";

    const applicationVersionSpy = getApplicationVersionSpy(VERSION_STATUS.OK);

    const { result } = renderHook(() => useAppCompabilityHook(), {
      wrapper,
    });
    const { isCompatible, updateUrl } = await result.current.getIsCompatible();

    expect(isCompatible).toBe(true);
    expect(updateUrl).toBe("");
    expect(applicationVersionSpy).not.toHaveBeenCalled();
  });

  it("calls the api for fetching application version status in `production`", async () => {
    expect.assertions(1);

    env.APP_ENV = "production";

    const applicationVersionSpy = getApplicationVersionSpy(
      VERSION_STATUS.UPDATE_REQUIRED
    );

    const { result } = renderHook(() => useAppCompabilityHook(), {
      wrapper,
    });
    await result.current.getIsCompatible();

    expect(applicationVersionSpy).toHaveBeenCalledTimes(1);
  });

  it("returns stored value once fetched in `production`", async () => {
    expect.assertions(1);

    env.APP_ENV = "production";

    const applicationVersionSpy = getApplicationVersionSpy(
      VERSION_STATUS.UPDATE_REQUIRED
    );

    const { result, rerender } = renderHook(() => useAppCompabilityHook(), {
      wrapper,
    });
    await result.current.getIsCompatible();

    rerender();
    await result.current.getIsCompatible();

    expect(applicationVersionSpy).toHaveBeenCalledTimes(1);
  });

  test.each([
    { status: VERSION_STATUS.OK, expectedResult: true },
    { status: VERSION_STATUS.UPDATE_OPTIONAL, expectedResult: true },
    { status: VERSION_STATUS.UPDATE_REQUIRED, expectedResult: false },
  ])(
    "hook returns isCompatible: $expectedResult for status: $status in `production`",
    async ({ status, expectedResult }) => {
      expect.assertions(2);

      env.APP_ENV = "production";

      const applicationVersionSpy = getApplicationVersionSpy(status);

      const { result } = renderHook(() => useAppCompabilityHook(), {
        wrapper,
      });
      const { isCompatible } = await result.current.getIsCompatible();

      expect(isCompatible).toBe(expectedResult);
      expect(applicationVersionSpy).toHaveBeenCalledTimes(1);
    }
  );
});
