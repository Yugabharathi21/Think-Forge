import { NavigateFunction } from 'react-router-dom';

export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  chat: '/chat',
  conversation: (id: string) => id === 'new' ? '/chat' : `/c/${id}`,
} as const;

export class Navigation {
  private navigate: NavigateFunction;

  constructor(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  // Public routes
  toLogin(options?: { replace?: boolean }) {
    this.navigate(routes.login, { replace: options?.replace });
  }

  toRegister(options?: { replace?: boolean }) {
    this.navigate(routes.register, { replace: options?.replace });
  }

  // Protected routes
  toHome(options?: { replace?: boolean }) {
    this.navigate(routes.home, { replace: options?.replace });
  }

  toChat(options?: { replace?: boolean }) {
    this.navigate(routes.chat, { replace: options?.replace });
  }

  toConversation(conversationId: string, options?: { replace?: boolean }) {
    this.navigate(routes.conversation(conversationId), { replace: options?.replace });
  }

  // Navigation helpers
  back() {
    this.navigate(-1);
  }

  replace(path: string) {
    this.navigate(path, { replace: true });
  }
}

export function createNavigation(navigate: NavigateFunction) {
  return new Navigation(navigate);
} 