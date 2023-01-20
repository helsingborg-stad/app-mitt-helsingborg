import React from "react";
import { render } from "../../../../test-utils";
import { EnvironmentServiceLocator } from "../../../services/environment";
import type {
  EnvironmentService,
  EnvironmentConfig,
} from "../../../services/environment/environmentService.types";
import AppSettingsModal from "./AppSettingsModal";

const MOCK_SERVICE: EnvironmentService = {
  getEnvironmentMap() {
    return {};
  },
  async parse() {
    //
  },
  async setActive() {
    //
  },
  getActive(): EnvironmentConfig {
    return { name: "", apiKey: "", url: "" };
  },
  async parseFromStorage() {
    //
  },
};

describe("AppSettingsModal", () => {
  it("renders without error", async () => {
    EnvironmentServiceLocator.register(MOCK_SERVICE);
    const func = () =>
      render(<AppSettingsModal visible toggle={() => undefined} />);
    expect(func).not.toThrow();
  });
});
