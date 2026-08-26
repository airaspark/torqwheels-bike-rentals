import { MOCK_CUSTOMERS } from '../data/mockData';
import { Customer } from '../types';

const CUSTOMERS_STORAGE_KEY = 'torqwheels_customers_db';

export class CustomerService {
  private static getStoredCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(MOCK_CUSTOMERS));
    return MOCK_CUSTOMERS;
  }

  private static saveCustomers(customers: Customer[]): void {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  }

  public static async getAllCustomers(): Promise<Customer[]> {
    await new Promise((res) => setTimeout(res, 60));
    return this.getStoredCustomers();
  }

  public static async getCustomerById(id: string): Promise<Customer | null> {
    const customers = await this.getAllCustomers();
    return customers.find((c) => c.id === id || c.email.toLowerCase() === id.toLowerCase()) || null;
  }

  public static async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const customers = this.getStoredCustomers();
    const index = customers.findIndex((c) => c.id === id || c.email.toLowerCase() === id.toLowerCase());
    if (index === -1) {
      // Create if doesn't exist
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: updates.name || 'Customer',
        email: updates.email || id,
        phone: updates.phone || '',
        drivingLicenceNumber: updates.drivingLicenceNumber || '',
        registeredDate: new Date().toISOString().split('T')[0],
        totalBookings: 1,
        totalSpent: updates.totalSpent || 0,
        status: 'Active',
        ...updates,
      };
      customers.push(newCust);
      this.saveCustomers(customers);
      return newCust;
    }
    customers[index] = { ...customers[index], ...updates };
    this.saveCustomers(customers);
    return customers[index];
  }

  public static async toggleCustomerStatus(id: string): Promise<Customer> {
    const customers = this.getStoredCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    customers[index].status = customers[index].status === 'Active' ? 'Blocked' : 'Active';
    this.saveCustomers(customers);
    return customers[index];
  }
}
