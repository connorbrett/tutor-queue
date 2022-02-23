export class EventBus {
  static User = new EventBus('user');

  constructor(private namespace: string) {}

  get(event: string): string {
    return `${this.namespace}:${event}`;
  }

  all(): string {
    return `${this.namespace}:*`;
  }
}
