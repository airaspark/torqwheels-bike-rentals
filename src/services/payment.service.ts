import { MOCK_PAYMENTS } from '../data/mockData';
import { PaymentTransaction, PaymentStatus, PaymentMethod } from '../types';

const PAYMENTS_STORAGE_KEY = 'torqwheels_payments_db';

export class PaymentService {
  private static getStoredPayments(): PaymentTransaction[] {
    try {
      const data = localStorage.getItem(PAYMENTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(MOCK_PAYMENTS));
    return MOCK_PAYMENTS;
  }

  private static savePayments(payments: PaymentTransaction[]): void {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
  }

  public static async getAllPayments(): Promise<PaymentTransaction[]> {
    await new Promise((res) => setTimeout(res, 60));
    return this.getStoredPayments();
  }

  public static async recordPayment(data: {
    bookingId: string;
    bookingCode: string;
    customerName: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
  }): Promise<PaymentTransaction> {
    const payments = this.getStoredPayments();
    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      ...data,
      date: new Date().toISOString(),
      gatewayRef: `${data.method.toUpperCase()}-TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };
    payments.unshift(newPayment);
    this.savePayments(payments);
    return newPayment;
  }

  public static async refundPayment(paymentId: string): Promise<PaymentTransaction> {
    const payments = this.getStoredPayments();
    const index = payments.findIndex((p) => p.id === paymentId);
    if (index === -1) throw new Error('Payment not found');
    payments[index].status = 'Refunded';
    this.savePayments(payments);
    return payments[index];
  }
}
