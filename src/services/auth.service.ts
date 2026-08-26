import { User } from '../types';

const AUTH_USER_KEY = 'torqwheels_auth_user';

const DEMO_CUSTOMER: User = {
  id: 'cust-001',
  name: 'Rohan Deshmukh',
  email: 'rohan.deshmukh@gmail.com',
  phone: '+91 98451 22345',
  role: 'customer',
  drivingLicenceNumber: 'KA-01-2021-0089241',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
};

const DEMO_ADMIN: User = {
  id: 'admin-001',
  name: 'Fleet Ops Admin',
  email: 'admin@torqwheels.in',
  phone: '+91 80 4123 7890',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
};

export class AuthService {
  private static user: User | null = null;
  private static listeners: Array<(user: User | null) => void> = [];

  public static init() {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        this.user = JSON.parse(stored);
      } else {
        // Default to logged-in demo customer for seamless immediate interaction
        this.user = DEMO_CUSTOMER;
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_CUSTOMER));
      }
    } catch {
      this.user = DEMO_CUSTOMER;
    }
  }

  public static getCurrentUser(): User | null {
    if (!this.user) {
      this.init();
    }
    return this.user;
  }

  public static subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);
    listener(this.getCurrentUser());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notify() {
    this.listeners.forEach((listener) => listener(this.user));
  }

  public static async login(email: string, _password?: string): Promise<User> {
    // Simulated async Firebase Auth login
    await new Promise((res) => setTimeout(res, 400));
    
    let loggedUser: User;
    if (email.toLowerCase().includes('admin')) {
      loggedUser = DEMO_ADMIN;
    } else {
      loggedUser = {
        id: `cust-${Date.now().toString().slice(-4)}`,
        name: email.split('@')[0].replace('.', ' ').replace(/^./, (c) => c.toUpperCase()),
        email,
        phone: '+91 98450 11223',
        role: 'customer',
        drivingLicenceNumber: 'KA-01-2022-0044192',
      };
    }

    this.user = loggedUser;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedUser));
    this.notify();
    return loggedUser;
  }

  public static async register(
    name: string,
    email: string,
    phone: string,
    drivingLicenceNumber: string,
    _password?: string
  ): Promise<User> {
    await new Promise((res) => setTimeout(res, 500));
    const newUser: User = {
      id: `cust-${Date.now().toString().slice(-5)}`,
      name,
      email,
      phone,
      role: 'customer',
      drivingLicenceNumber,
    };
    this.user = newUser;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    this.notify();
    return newUser;
  }

  public static async loginAsDemoCustomer(): Promise<User> {
    this.user = DEMO_CUSTOMER;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_CUSTOMER));
    this.notify();
    return DEMO_CUSTOMER;
  }

  public static async loginAsAdmin(): Promise<User> {
    this.user = DEMO_ADMIN;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_ADMIN));
    this.notify();
    return DEMO_ADMIN;
  }

  public static async updateProfile(data: Partial<User>): Promise<User> {
    if (!this.user) throw new Error('Not authenticated');
    this.user = { ...this.user, ...data };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(this.user));
    this.notify();
    return this.user;
  }

  public static async logout(): Promise<void> {
    this.user = null;
    localStorage.removeItem(AUTH_USER_KEY);
    this.notify();
  }
}
