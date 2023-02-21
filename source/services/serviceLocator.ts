import type { IServiceLocator, ServiceTypes } from "./serviceLocator.types";

export class ServiceLocator implements IServiceLocator {
  private services: Partial<ServiceTypes> = {};

  private static instance: ServiceLocator | null = null;

  register<K extends keyof ServiceTypes>(id: K, value: ServiceTypes[K]): void {
    this.services[id] = value;
  }

  get<K extends keyof ServiceTypes>(id: K): ServiceTypes[K] {
    const service = this.services[id];

    if (!service) {
      throw new Error(`No instance registered for service '${id}'`);
    }

    return service;
  }

  static getInstance(): ServiceLocator {
    if (!this.instance) {
      this.instance = new ServiceLocator();
    }

    return this.instance;
  }

  static setGlobalInstance(serviceLocator: ServiceLocator): void {
    this.instance = serviceLocator;
  }
}
