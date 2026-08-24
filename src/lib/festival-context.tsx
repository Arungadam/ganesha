'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Organization,
  Contribution,
  Contributor,
  Expense,
  FestivalEvent,
  CommitteeMember,
  AuditLog,
  DashboardMetrics,
  PaymentMethod,
  ExpenseCategory,
  FestivalYearConfig,
} from '@/types';
import { storage } from './storage';

interface FestivalContextType {
  organization: Organization;
  activeYear: number;
  yearConfig: FestivalYearConfig;
  contributions: Contribution[];
  contributors: Contributor[];
  expenses: Expense[];
  events: FestivalEvent[];
  members: CommitteeMember[];
  auditLogs: AuditLog[];
  metrics: DashboardMetrics;
  refreshData: () => void;
  setActiveYear: (year: number) => void;
  addNewYear: (year: number, target: number, startDate: string, endDate: string, visarjanDate: string) => void;
  updateOrganization: (org: Organization) => void;
  addContribution: (data: {
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
  }) => { contribution: Contribution; contributor: Contributor };
  checkDuplicatePhone: (phone: string) => Contributor | null;
  addExpense: (data: {
    expenseName: string;
    category: ExpenseCategory;
    amount: number;
    date: string;
    paidBy: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    billReceiptUrl?: string;
  }) => Expense;
  deleteExpense: (id: string) => void;
  addEvent: (data: Omit<FestivalEvent, 'id' | 'committeeId' | 'year'>) => FestivalEvent;
  addMember: (data: Omit<CommitteeMember, 'id' | 'committeeId' | 'totalCollected' | 'collectionCount' | 'joinedDate' | 'isActive'>) => CommitteeMember;
  resetDemo: () => void;
  clearToEmptyData: () => void;
  activeReceipt: Contribution | null;
  setActiveReceipt: (c: Contribution | null) => void;
  isAddChandaOpen: boolean;
  setIsAddChandaOpen: (open: boolean) => void;
}

const FestivalContext = createContext<FestivalContextType | undefined>(undefined);

export function FestivalProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganization] = useState<Organization>(storage.getOrganization());
  const [activeYear, setActiveYearState] = useState<number>(storage.getActiveYear());
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>(storage.getDashboardMetrics(activeYear));
  const [activeReceipt, setActiveReceipt] = useState<Contribution | null>(null);
  const [isAddChandaOpen, setIsAddChandaOpen] = useState<boolean>(false);

  const refreshData = useCallback(() => {
    const currentYear = storage.getActiveYear();
    const org = storage.getOrganization();
    setOrganization(org);
    setActiveYearState(currentYear);
    setContributions(storage.getContributions(currentYear));
    setContributors(storage.getContributors(currentYear));
    setExpenses(storage.getExpenses(currentYear));
    setEvents(storage.getEvents(currentYear));
    setMembers(storage.getMembers());
    setAuditLogs(storage.getAuditLogs(currentYear));
    setMetrics(storage.getDashboardMetrics(currentYear));
  }, []);

  useEffect(() => {
    storage.initializeStorage();
    refreshData();
  }, [refreshData]);

  const changeActiveYear = (year: number) => {
    storage.setActiveYear(year);
    setActiveYearState(year);
    refreshData();
  };

  const addNewYear = (year: number, target: number, startDate: string, endDate: string, visarjanDate: string) => {
    storage.addFestivalYear(year, target, startDate, endDate, visarjanDate);
    refreshData();
  };

  const updateOrganization = (org: Organization) => {
    storage.saveOrganization(org);
    setOrganization(org);
    refreshData();
  };

  const handleAddContribution = (data: {
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
  }) => {
    const result = storage.addContribution({ ...data, year: activeYear });
    refreshData();
    setActiveReceipt(result.contribution);
    return result;
  };

  const handleAddExpense = (data: {
    expenseName: string;
    category: ExpenseCategory;
    amount: number;
    date: string;
    paidBy: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    billReceiptUrl?: string;
  }) => {
    const exp = storage.addExpense({ ...data, year: activeYear });
    refreshData();
    return exp;
  };

  const handleDeleteExpense = (id: string) => {
    storage.deleteExpense(id);
    refreshData();
  };

  const handleAddEvent = (data: Omit<FestivalEvent, 'id' | 'committeeId' | 'year'>) => {
    const newEvt = storage.addEvent({
      ...data,
      committeeId: organization.id,
      year: activeYear,
    });
    refreshData();
    return newEvt;
  };

  const handleAddMember = (data: Omit<CommitteeMember, 'id' | 'committeeId' | 'totalCollected' | 'collectionCount' | 'joinedDate' | 'isActive'>) => {
    const mem = storage.addMember({
      ...data,
      committeeId: organization.id,
    });
    refreshData();
    return mem;
  };

  const resetDemo = () => {
    storage.resetToDemoData();
    refreshData();
  };

  const clearToEmptyData = () => {
    storage.clearToEmptyData();
    refreshData();
  };

  const yearConfig =
    organization.years.find((y) => y.year === activeYear) ||
    organization.years[0] || {
      id: `year-${activeYear}`,
      year: activeYear,
      startDate: `${activeYear}-09-14`,
      endDate: `${activeYear}-09-24`,
      visarjanDate: `${activeYear}-09-24`,
      chandaTarget: 200000,
      upiId: 'ganeshseva@upi',
      isActive: true,
    };

  return (
    <FestivalContext.Provider
      value={{
        organization,
        activeYear,
        yearConfig,
        contributions,
        contributors,
        expenses,
        events,
        members,
        auditLogs,
        metrics,
        refreshData,
        setActiveYear: changeActiveYear,
        addNewYear,
        updateOrganization,
        addContribution: handleAddContribution,
        checkDuplicatePhone: (phone: string) => storage.checkDuplicatePhone(phone, activeYear),
        addExpense: handleAddExpense,
        deleteExpense: handleDeleteExpense,
        addEvent: handleAddEvent,
        addMember: handleAddMember,
        resetDemo,
        clearToEmptyData,
        activeReceipt,
        setActiveReceipt,
        isAddChandaOpen,
        setIsAddChandaOpen,
      }}
    >
      {children}
    </FestivalContext.Provider>
  );
}

export function useFestival() {
  const context = useContext(FestivalContext);
  if (!context) {
    throw new Error('useFestival must be used within a FestivalProvider');
  }
  return context;
}
