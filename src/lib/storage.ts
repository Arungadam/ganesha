import {
  Organization,
  Contributor,
  Contribution,
  Expense,
  FestivalEvent,
  CommitteeMember,
  AuditLog,
  User,
  DashboardMetrics,
  ExpenseCategory,
  PaymentMethod,
} from '@/types';
import {
  DEMO_ORGANIZATION,
  DEMO_USERS,
  DEMO_MEMBERS,
  DEMO_CONTRIBUTORS,
  DEMO_CONTRIBUTIONS,
  DEMO_EXPENSES,
  DEMO_EVENTS,
  DEMO_AUDIT_LOGS,
} from './demo-data';

const STORAGE_KEYS = {
  CURRENT_USER: 'ganesh_seva_current_user',
  ORGANIZATION: 'ganesh_seva_organization',
  USERS: 'ganesh_seva_users',
  MEMBERS: 'ganesh_seva_members',
  CONTRIBUTORS: 'ganesh_seva_contributors',
  CONTRIBUTIONS: 'ganesh_seva_contributions',
  EXPENSES: 'ganesh_seva_expenses',
  EVENTS: 'ganesh_seva_events',
  AUDIT_LOGS: 'ganesh_seva_audit_logs',
  CURRENT_YEAR: 'ganesh_seva_active_year',
  INITIALIZED: 'ganesh_seva_initialized_v1',
};

class StorageEngine {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public initializeStorage(): void {
    if (!this.isBrowser()) return;

    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this.resetToDemoData();
    }
  }

  public resetToDemoData(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ORGANIZATION, JSON.stringify(DEMO_ORGANIZATION));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(DEMO_MEMBERS));
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTORS, JSON.stringify(DEMO_CONTRIBUTORS));
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(DEMO_CONTRIBUTIONS));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEMO_EXPENSES));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEMO_EVENTS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEMO_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_YEAR, '2026');
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'demo');
  }

  public clearToEmptyData(): void {
    if (!this.isBrowser()) return;
    const emptyOrg: Organization = {
      id: 'org-fresh-committee',
      name: 'Your Ganesh Utsav Committee',
      slug: 'your-ganesh-utsav-committee',
      organizerName: 'Organizer Name',
      contactNumber: '9848000000',
      location: {
        state: 'State',
        district: 'District',
        village: 'Village / Town',
        area: 'Area / Colony',
        galli: 'Galli / Street Name',
      },
      currentYear: 2026,
      years: [
        {
          id: 'year-2026',
          year: 2026,
          startDate: '2026-09-14',
          endDate: '2026-09-24',
          visarjanDate: '2026-09-24',
          chandaTarget: 100000,
          upiId: 'yourname@upi',
          isActive: true,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const adminUser: User = {
      id: 'usr-admin-1',
      name: 'Committee Admin',
      email: 'admin@ganeshseva.org',
      mobile: '9848000000',
      role: 'owner',
      committeeId: 'org-fresh-committee',
      createdAt: new Date().toISOString(),
    };

    const initialMember: CommitteeMember = {
      id: 'mem-1',
      committeeId: 'org-fresh-committee',
      userId: 'usr-admin-1',
      name: 'Committee Admin',
      phone: '9848000000',
      email: 'admin@ganeshseva.org',
      role: 'owner',
      totalCollected: 0,
      collectionCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    localStorage.setItem(STORAGE_KEYS.ORGANIZATION, JSON.stringify(emptyOrg));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser]));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(adminUser));
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([initialMember]));
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTORS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CURRENT_YEAR, '2026');
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'empty');
  }

  // --- Current User / Session ---
  public getCurrentUser(): User | null {
    if (!this.isBrowser()) return DEMO_USERS[0];
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : DEMO_USERS[0];
  }

  public setCurrentUser(user: User | null): void {
    if (!this.isBrowser()) return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  public getUsers(): User[] {
    if (!this.isBrowser()) return DEMO_USERS;
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : DEMO_USERS;
  }

  public registerUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      this.setCurrentUser(newUser);
    }
    return newUser;
  }

  // --- Organization & Year ---
  public getOrganization(): Organization {
    if (!this.isBrowser()) return DEMO_ORGANIZATION;
    const data = localStorage.getItem(STORAGE_KEYS.ORGANIZATION);
    return data ? JSON.parse(data) : DEMO_ORGANIZATION;
  }

  public saveOrganization(org: Organization): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ORGANIZATION, JSON.stringify(org));
  }

  public getActiveYear(): number {
    if (!this.isBrowser()) return 2026;
    const y = localStorage.getItem(STORAGE_KEYS.CURRENT_YEAR);
    return y ? parseInt(y, 10) : 2026;
  }

  public setActiveYear(year: number): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_YEAR, year.toString());
  }

  public addFestivalYear(year: number, target: number, startDate: string, endDate: string, visarjanDate: string): void {
    const org = this.getOrganization();
    if (!org.years.some((y) => y.year === year)) {
      org.years.push({
        id: `year-${year}`,
        year,
        startDate,
        endDate,
        visarjanDate,
        chandaTarget: target,
        upiId: org.years[0]?.upiId || 'ganeshseva@upi',
        isActive: false,
      });
      org.years.sort((a, b) => b.year - a.year);
      this.saveOrganization(org);
      this.setActiveYear(year);
    }
  }

  // --- Chanda Contributions ---
  public getContributions(year?: number): Contribution[] {
    if (!this.isBrowser()) return DEMO_CONTRIBUTIONS;
    const data = localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS);
    const list: Contribution[] = data ? JSON.parse(data) : DEMO_CONTRIBUTIONS;
    const activeY = year ?? this.getActiveYear();
    return list.filter((c) => c.year === activeY);
  }

  public generateReceiptNumber(year: number): string {
    const yearShort = year.toString().slice(-2);
    const all = this.getContributions(year);
    const nextSeq = all.length + 241; // Start standard festival serial
    return `GS${yearShort}-${nextSeq.toString().padStart(6, '0')}`;
  }

  public checkDuplicatePhone(phone: string, year?: number): Contributor | null {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 5) return null;
    const contributors = this.getContributors(year);
    return contributors.find((c) => c.phone.replace(/\D/g, '') === clean) || null;
  }

  public addContribution(data: {
    contributorName: string;
    contributorPhone: string;
    amount: number;
    paidAmount?: number;
    paymentMethod: PaymentMethod;
    paymentStatus?: 'Paid' | 'Pending' | 'Partially Paid';
    collectorName: string;
    collectorId?: string;
    notes?: string;
    galli?: string;
    date?: string;
    time?: string;
    year?: number;
  }): { contribution: Contribution; contributor: Contributor } {
    const year = data.year ?? this.getActiveYear();
    const org = this.getOrganization();
    const cleanPhone = data.contributorPhone.trim();

    // 1. Find or create Contributor
    const allContributors = this.getAllContributorsRaw();
    let contributor = allContributors.find(
      (c) => c.year === year && c.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '')
    );

    const paid = data.paymentStatus === 'Pending' ? 0 : data.paidAmount ?? data.amount;
    const pending = data.amount - paid;
    const now = new Date();
    const dateStr = data.date || now.toISOString().split('T')[0];
    const timeStr = data.time || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (contributor) {
      contributor.totalDonated += paid;
      contributor.totalPending += pending;
      contributor.contributionCount += 1;
      contributor.lastDonationDate = dateStr;
    } else {
      contributor = {
        id: `ctb-${Date.now()}`,
        committeeId: org.id,
        year,
        name: data.contributorName.trim(),
        phone: cleanPhone,
        address: data.galli || org.location.galli,
        totalDonated: paid,
        totalPending: pending,
        contributionCount: 1,
        firstDonationDate: dateStr,
        lastDonationDate: dateStr,
      };
      allContributors.push(contributor);
    }

    // 2. Create Contribution
    const receiptNumber = this.generateReceiptNumber(year);
    const newContribution: Contribution = {
      id: `cnt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      receiptNumber,
      committeeId: org.id,
      year,
      contributorId: contributor.id,
      contributorName: data.contributorName.trim(),
      contributorPhone: cleanPhone,
      amount: data.amount,
      paidAmount: paid,
      date: dateStr,
      time: timeStr,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus || (pending === 0 ? 'Paid' : pending === data.amount ? 'Pending' : 'Partially Paid'),
      collectorName: data.collectorName,
      collectorId: data.collectorId || 'mem-collector',
      notes: data.notes,
      galli: data.galli || org.location.galli,
      createdAt: now.toISOString(),
    };

    const allContributions = this.getAllContributionsRaw();
    allContributions.unshift(newContribution);

    // 3. Update collector stats
    const members = this.getMembers();
    const member = members.find((m) => m.name.toLowerCase() === data.collectorName.toLowerCase());
    if (member) {
      member.totalCollected += paid;
      member.collectionCount += 1;
      if (this.isBrowser()) {
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
      }
    }

    // 4. Save
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CONTRIBUTORS, JSON.stringify(allContributors));
      localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(allContributions));
      this.logAudit(
        `Chanda Collected`,
        data.collectorName,
        'collector',
        `Collected ₹${data.amount.toLocaleString('en-IN')} from ${data.contributorName} (${receiptNumber})`
      );
    }

    return { contribution: newContribution, contributor };
  }

  // --- Contributors ---
  private getAllContributorsRaw(): Contributor[] {
    if (!this.isBrowser()) return DEMO_CONTRIBUTORS;
    const data = localStorage.getItem(STORAGE_KEYS.CONTRIBUTORS);
    return data ? JSON.parse(data) : DEMO_CONTRIBUTORS;
  }

  private getAllContributionsRaw(): Contribution[] {
    if (!this.isBrowser()) return DEMO_CONTRIBUTIONS;
    const data = localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS);
    return data ? JSON.parse(data) : DEMO_CONTRIBUTIONS;
  }

  public getContributors(year?: number): Contributor[] {
    const all = this.getAllContributorsRaw();
    const activeY = year ?? this.getActiveYear();
    return all.filter((c) => c.year === activeY);
  }

  // --- Expenses ---
  public getExpenses(year?: number): Expense[] {
    if (!this.isBrowser()) return DEMO_EXPENSES;
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const list: Expense[] = data ? JSON.parse(data) : DEMO_EXPENSES;
    const activeY = year ?? this.getActiveYear();
    return list.filter((e) => e.year === activeY);
  }

  public addExpense(data: {
    expenseName: string;
    category: ExpenseCategory;
    amount: number;
    date: string;
    paidBy: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    billReceiptUrl?: string;
    year?: number;
  }): Expense {
    const year = data.year ?? this.getActiveYear();
    const org = this.getOrganization();
    const allExpenses = this.getAllExpensesRaw();

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      committeeId: org.id,
      year,
      expenseName: data.expenseName.trim(),
      category: data.category,
      amount: data.amount,
      date: data.date || new Date().toISOString().split('T')[0],
      paidBy: data.paidBy.trim(),
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      billReceiptUrl: data.billReceiptUrl,
      createdAt: new Date().toISOString(),
    };

    allExpenses.unshift(newExpense);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(allExpenses));
      this.logAudit(
        `Expense Added`,
        data.paidBy,
        'admin',
        `Spent ₹${data.amount.toLocaleString('en-IN')} for ${data.category}: ${data.expenseName}`
      );
    }
    return newExpense;
  }

  public deleteExpense(id: string): void {
    if (!this.isBrowser()) return;
    const all = this.getAllExpensesRaw().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(all));
  }

  private getAllExpensesRaw(): Expense[] {
    if (!this.isBrowser()) return DEMO_EXPENSES;
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : DEMO_EXPENSES;
  }

  // --- Events ---
  public getEvents(year?: number): FestivalEvent[] {
    if (!this.isBrowser()) return DEMO_EVENTS;
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    const list: FestivalEvent[] = data ? JSON.parse(data) : DEMO_EVENTS;
    const activeY = year ?? this.getActiveYear();
    return list.filter((e) => e.year === activeY);
  }

  public addEvent(data: Omit<FestivalEvent, 'id'>): FestivalEvent {
    const all = this.getAllEventsRaw();
    const newEvent: FestivalEvent = {
      ...data,
      id: `evt-${Date.now()}`,
    };
    all.push(newEvent);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(all));
    }
    return newEvent;
  }

  private getAllEventsRaw(): FestivalEvent[] {
    if (!this.isBrowser()) return DEMO_EVENTS;
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return data ? JSON.parse(data) : DEMO_EVENTS;
  }

  // --- Members ---
  public getMembers(): CommitteeMember[] {
    if (!this.isBrowser()) return DEMO_MEMBERS;
    const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return data ? JSON.parse(data) : DEMO_MEMBERS;
  }

  public addMember(member: Omit<CommitteeMember, 'id' | 'totalCollected' | 'collectionCount' | 'joinedDate' | 'isActive'>): CommitteeMember {
    const members = this.getMembers();
    const newMem: CommitteeMember = {
      ...member,
      id: `mem-${Date.now()}`,
      totalCollected: 0,
      collectionCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    members.push(newMem);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
      this.logAudit('Member Added', 'Admin', 'admin', `Added ${newMem.name} as ${newMem.role}`);
    }
    return newMem;
  }

  // --- Audit Logs ---
  public getAuditLogs(year?: number): AuditLog[] {
    if (!this.isBrowser()) return DEMO_AUDIT_LOGS;
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    const list: AuditLog[] = data ? JSON.parse(data) : DEMO_AUDIT_LOGS;
    const activeY = year ?? this.getActiveYear();
    return list.filter((l) => l.year === activeY);
  }

  public logAudit(action: string, actorName: string, actorRole: string, details: string): void {
    if (!this.isBrowser()) return;
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    const list: AuditLog[] = data ? JSON.parse(data) : DEMO_AUDIT_LOGS;
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      committeeId: this.getOrganization().id,
      year: this.getActiveYear(),
      action,
      actorName,
      actorRole,
      details,
      timestamp: new Date().toISOString(),
    };
    list.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(list.slice(0, 100)));
  }

  // --- Dashboard Metrics Calculation ---
  public getDashboardMetrics(year?: number): DashboardMetrics {
    const activeY = year ?? this.getActiveYear();
    const org = this.getOrganization();
    const yearConfig = org.years.find((y) => y.year === activeY) || org.years[0] || {
      chandaTarget: 200000,
    };

    const contributions = this.getContributions(activeY);
    const contributors = this.getContributors(activeY);
    const expenses = this.getExpenses(activeY);
    const events = this.getEvents(activeY);

    const totalCollection = contributions.reduce((sum, c) => sum + (c.paidAmount || c.amount), 0);
    const pendingCollections = contributions.reduce((sum, c) => sum + (c.amount - (c.paidAmount || 0)), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBalance = totalCollection - totalExpenses;
    const collectionTarget = yearConfig.chandaTarget || 200000;
    const collectionProgressPercent = Math.min(
      100,
      collectionTarget > 0 ? Math.round((totalCollection / collectionTarget) * 1000) / 10 : 0
    );

    // Expense Categories
    const categoryMap: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    const categoryExpenses = Object.entries(categoryMap).map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    }));
    categoryExpenses.sort((a, b) => b.amount - a.amount);

    // Daily Collections (last 10 entries aggregated)
    const dailyMap: Record<string, { amount: number; count: number }> = {};
    contributions.forEach((c) => {
      if (!dailyMap[c.date]) dailyMap[c.date] = { amount: 0, count: 0 };
      dailyMap[c.date].amount += c.paidAmount || c.amount;
      dailyMap[c.date].count += 1;
    });

    const dailyCollections = Object.entries(dailyMap)
      .map(([date, val]) => ({ date, amount: val.amount, count: val.count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Payment Method Split
    const methodMap: Record<PaymentMethod, { amount: number; count: number }> = {
      Cash: { amount: 0, count: 0 },
      UPI: { amount: 0, count: 0 },
      'Bank Transfer': { amount: 0, count: 0 },
      Other: { amount: 0, count: 0 },
    };

    contributions.forEach((c) => {
      const method = c.paymentMethod || 'Cash';
      if (methodMap[method]) {
        methodMap[method].amount += c.paidAmount || c.amount;
        methodMap[method].count += 1;
      }
    });

    const paymentMethodStats = Object.entries(methodMap).map(([method, val]) => ({
      method: method as PaymentMethod,
      amount: val.amount,
      count: val.count,
    }));

    return {
      totalCollection,
      totalContributors: contributors.length,
      totalExpenses,
      remainingBalance,
      collectionTarget,
      collectionProgressPercent,
      paidCollections: totalCollection,
      pendingCollections,
      recentContributions: contributions.slice(0, 8),
      upcomingEvents: events.slice(0, 4),
      categoryExpenses,
      dailyCollections,
      paymentMethodStats,
    };
  }

  // --- Export to CSV ---
  public exportContributorsCSV(year?: number): void {
    const list = this.getContributions(year);
    const headers = [
      'Receipt No',
      'Contributor Name',
      'Phone Number',
      'Amount (INR)',
      'Paid Amount',
      'Date',
      'Payment Method',
      'Payment Status',
      'Collector',
      'Galli/Street',
      'Notes',
    ];

    const rows = list.map((c) => [
      c.receiptNumber,
      `"${c.contributorName}"`,
      c.contributorPhone,
      c.amount,
      c.paidAmount,
      c.date,
      c.paymentMethod,
      c.paymentStatus,
      `"${c.collectorName}"`,
      `"${c.galli || ''}"`,
      `"${c.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ganesh_seva_contributions_${this.getActiveYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public exportExpensesCSV(year?: number): void {
    const list = this.getExpenses(year);
    const headers = ['Expense Name', 'Category', 'Amount (INR)', 'Date', 'Paid By', 'Payment Method', 'Notes'];

    const rows = list.map((e) => [
      `"${e.expenseName}"`,
      e.category,
      e.amount,
      e.date,
      `"${e.paidBy}"`,
      e.paymentMethod,
      `"${e.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ganesh_seva_expenses_${this.getActiveYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const storage = new StorageEngine();
