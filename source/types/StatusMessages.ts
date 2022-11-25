export enum Type {
  Info = "info",
  Warning = "warning",
  Maintenance = "maintenance",
}

export interface Message {
  title: string;
  text: string;
}

export interface Messages {
  message: Message;
  type: Type;
}
