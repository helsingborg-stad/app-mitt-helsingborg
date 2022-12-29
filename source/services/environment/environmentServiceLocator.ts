import type { EnvironmentService } from "./environmentService.types";

export default class EnvironmentServiceLocator {
  private static service: EnvironmentService | null = null;

  static register(service: EnvironmentService): void {
    this.service = service;
  }

  static get(): EnvironmentService {
    if (!this.service) {
      throw new Error("No EnvironmentService registered");
    }
    return this.service;
  }

  static clear(): void {
    this.service = null;
  }
}
