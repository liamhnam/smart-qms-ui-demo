'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Category, Counter, Ticket, CitizenInfo, SystemKPIs } from '../types/qms';
import { INITIAL_CATEGORIES, INITIAL_COUNTERS, INITIAL_TICKETS } from '../data/mockData';
import { announceTicketCalling } from '../utils/audio';

interface QmsContextType {
  categories: Category[];
  counters: Counter[];
  tickets: Ticket[];
  activeCounterId: string;
  setActiveCounterId: (id: string) => void;
  activeCounter: Counter | undefined;
  recentlyCalledTicket: Ticket | null;
  activeEvaluationTicket: Ticket | null;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  kpis: SystemKPIs;
  
  // Actions
  issueTicket: (categoryId: string, citizen: CitizenInfo) => Ticket;
  callNextTicket: (counterId: string) => Ticket | null;
  recallTicket: (counterId: string) => void;
  completeServingTicket: (counterId: string) => void;
  skipServingTicket: (counterId: string) => void;
  transferServingTicket: (counterId: string, targetCounterId: string) => void;
  submitTicketRating: (ticketId: string, rating: { score: number; tags: string[]; feedback?: string }) => void;
  dismissEvaluation: () => void;
  resetDemoData: () => void;
  injectRandomCitizen: () => Ticket;
}

const QmsContext = createContext<QmsContextType | undefined>(undefined);

const STORAGE_KEY = 'SMART_QMS_DEMO_STATE_V1';

export function QmsProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [counters, setCounters] = useState<Counter[]>(INITIAL_COUNTERS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [activeCounterId, setActiveCounterId] = useState<string>('counter-01');
  const [recentlyCalledTicket, setRecentlyCalledTicket] = useState<Ticket | null>(null);
  const [activeEvaluationTicket, setActiveEvaluationTicket] = useState<Ticket | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Load from localStorage on mount if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tickets) setTickets(parsed.tickets);
        if (parsed.counters) setCounters(parsed.counters);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.activeCounterId) setActiveCounterId(parsed.activeCounterId);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tickets, counters, categories, activeCounterId })
      );
    } catch {
      // Ignore
    }
  }, [tickets, counters, categories, activeCounterId]);

  const activeCounter = counters.find((c) => c.id === activeCounterId) || counters[0];

  // Issue new ticket (e.g. from Kiosk)
  const issueTicket = useCallback(
    (categoryId: string, citizen: CitizenInfo): Ticket => {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) throw new Error('Category not found');

      const nextNum = category.currentNumber + 1;
      const formattedNum = `${category.prefix}-${String(nextNum).padStart(3, '0')}`;

      // Update category number and waiting count
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, currentNumber: nextNum, waitingCount: c.waitingCount + 1 }
            : c
        )
      );

      const newTicket: Ticket = {
        id: `ticket-${Date.now()}`,
        ticketNumber: formattedNum,
        categoryId: category.id,
        categoryName: category.name,
        citizen,
        status: 'WAITING',
        issuedAt: new Date().toISOString(),
        estimatedWaitMinutes: (category.waitingCount + 1) * category.averageWaitMinutes,
      };

      setTickets((prev) => [...prev, newTicket]);
      return newTicket;
    },
    [categories]
  );

  // Call next ticket at a counter
  const callNextTicket = useCallback(
    (counterId: string): Ticket | null => {
      const counter = counters.find((c) => c.id === counterId);
      if (!counter) return null;

      // Find eligible waiting ticket (priority first, then earlier issuedAt)
      const waiting = tickets
        .filter((t) => t.status === 'WAITING' && counter.categoryIds.includes(t.categoryId))
        .sort((a, b) => {
          if (a.citizen.isPriority && !b.citizen.isPriority) return -1;
          if (!a.citizen.isPriority && b.citizen.isPriority) return 1;
          return new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
        });

      if (waiting.length === 0) return null;

      const nextTicket = waiting[0];
      const nowIso = new Date().toISOString();

      // If counter was currently serving another ticket, auto-complete it
      if (counter.currentTicketId) {
        setTickets((prev) =>
          prev.map((t) =>
            t.id === counter.currentTicketId && t.status === 'SERVING'
              ? { ...t, status: 'COMPLETED', completedAt: nowIso }
              : t
          )
        );
      }

      const updatedTicket: Ticket = {
        ...nextTicket,
        status: 'SERVING',
        counterId: counter.id,
        counterTitle: counter.title,
        calledAt: nowIso,
        serviceDurationSeconds: 0,
      };

      setTickets((prev) =>
        prev.map((t) => (t.id === nextTicket.id ? updatedTicket : t))
      );

      setCounters((prev) =>
        prev.map((c) =>
          c.id === counterId
            ? {
                ...c,
                currentTicketId: updatedTicket.id,
                todayServedCount: c.todayServedCount + 1,
              }
            : c
        )
      );

      // Decrement waiting count on category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === nextTicket.categoryId
            ? { ...cat, waitingCount: Math.max(0, cat.waitingCount - 1) }
            : cat
        )
      );

      setRecentlyCalledTicket(updatedTicket);

      // Play audio chime and voice announcement
      if (isSoundEnabled) {
        announceTicketCalling(updatedTicket.ticketNumber, counter.title.split('-')[0].trim());
      }

      return updatedTicket;
    },
    [counters, tickets, isSoundEnabled]
  );

  // Recall current serving ticket with audio alert
  const recallTicket = useCallback(
    (counterId: string) => {
      const counter = counters.find((c) => c.id === counterId);
      if (!counter || !counter.currentTicketId) return;

      const servingTicket = tickets.find((t) => t.id === counter.currentTicketId);
      if (!servingTicket) return;

      setRecentlyCalledTicket(servingTicket);

      if (isSoundEnabled) {
        announceTicketCalling(servingTicket.ticketNumber, counter.title.split('-')[0].trim());
      }
    },
    [counters, tickets, isSoundEnabled]
  );

  // Complete serving ticket and prompt evaluation on tablet
  const completeServingTicket = useCallback(
    (counterId: string) => {
      const counter = counters.find((c) => c.id === counterId);
      if (!counter || !counter.currentTicketId) return;

      const ticketToComplete = tickets.find((t) => t.id === counter.currentTicketId);
      if (!ticketToComplete) return;

      const completedTicket: Ticket = {
        ...ticketToComplete,
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
      };

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketToComplete.id ? completedTicket : t))
      );

      setCounters((prev) =>
        prev.map((c) =>
          c.id === counterId ? { ...c, currentTicketId: undefined } : c
        )
      );

      // Trigger tablet evaluation
      setActiveEvaluationTicket(completedTicket);
    },
    [counters, tickets]
  );

  // Skip serving ticket
  const skipServingTicket = useCallback(
    (counterId: string) => {
      const counter = counters.find((c) => c.id === counterId);
      if (!counter || !counter.currentTicketId) return;

      const ticketToSkip = tickets.find((t) => t.id === counter.currentTicketId);
      if (!ticketToSkip) return;

      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketToSkip.id ? { ...t, status: 'SKIPPED' } : t
        )
      );

      setCounters((prev) =>
        prev.map((c) =>
          c.id === counterId ? { ...c, currentTicketId: undefined } : c
        )
      );
    },
    [counters, tickets]
  );

  // Transfer serving ticket to another counter/category
  const transferServingTicket = useCallback(
    (counterId: string, targetCounterId: string) => {
      const counter = counters.find((c) => c.id === counterId);
      const targetCounter = counters.find((c) => c.id === targetCounterId);
      if (!counter || !targetCounter || !counter.currentTicketId) return;

      const ticket = tickets.find((t) => t.id === counter.currentTicketId);
      if (!ticket) return;

      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticket.id
            ? {
                ...t,
                status: 'WAITING',
                counterId: undefined,
                counterTitle: undefined,
                categoryId: targetCounter.categoryIds[0] || t.categoryId,
                citizen: { ...t.citizen, isPriority: true }, // transfer gets priority
              }
            : t
        )
      );

      setCounters((prev) =>
        prev.map((c) =>
          c.id === counterId ? { ...c, currentTicketId: undefined } : c
        )
      );
    },
    [counters, tickets]
  );

  // Submit feedback rating from tablet
  const submitTicketRating = useCallback(
    (ticketId: string, rating: { score: number; tags: string[]; feedback?: string }) => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                rating: {
                  ...rating,
                  submittedAt: new Date().toISOString(),
                },
              }
            : t
        )
      );
      // Dismiss after short celebration
      setTimeout(() => {
        setActiveEvaluationTicket(null);
      }, 3500);
    },
    []
  );

  const dismissEvaluation = useCallback(() => {
    setActiveEvaluationTicket(null);
  }, []);

  // Reset demo state
  const resetDemoData = useCallback(() => {
    setCategories(INITIAL_CATEGORIES);
    setCounters(INITIAL_COUNTERS);
    setTickets(INITIAL_TICKETS);
    setActiveCounterId('counter-01');
    setRecentlyCalledTicket(null);
    setActiveEvaluationTicket(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Inject random citizen (helper for presentation)
  const injectRandomCitizen = useCallback((): Ticket => {
    const randomNames = [
      'Lê Tuấn Kiệt',
      'Trần Hoàng Yến',
      'Đặng Quốc Bảo',
      'Vũ Thu Trang',
      'Bùi Quang Dũng',
      'Nguyễn Thanh Trúc',
      'Hoàng Văn Long',
    ];
    const name = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const isPriority = Math.random() > 0.75;

    return issueTicket(randomCat.id, {
      name: isPriority ? `${name} (Ưu tiên)` : name,
      citizenId: `079${Math.floor(100000000 + Math.random() * 900000000)}`,
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      isPriority,
    });
  }, [categories, issueTicket]);

  // Compute live KPIs
  const waitingTickets = tickets.filter((t) => t.status === 'WAITING');
  const servingTickets = tickets.filter((t) => t.status === 'SERVING');
  const completedTickets = tickets.filter((t) => t.status === 'COMPLETED');
  const skippedTickets = tickets.filter((t) => t.status === 'SKIPPED');

  const ratedTickets = completedTickets.filter((t) => t.rating);
  const positiveRatings = ratedTickets.filter((t) => (t.rating?.score || 0) >= 4);
  const satisfactionRate =
    ratedTickets.length > 0
      ? Math.round((positiveRatings.length / ratedTickets.length) * 100)
      : 98;

  const kpis: SystemKPIs = {
    totalIssuedToday: tickets.length,
    currentlyWaiting: waitingTickets.length,
    currentlyServing: servingTickets.length,
    completedToday: completedTickets.length,
    skippedToday: skippedTickets.length,
    averageWaitMinutes: 6.8,
    averageServeMinutes: 8.2,
    satisfactionRate,
  };

  return (
    <QmsContext.Provider
      value={{
        categories,
        counters,
        tickets,
        activeCounterId,
        setActiveCounterId,
        activeCounter,
        recentlyCalledTicket,
        activeEvaluationTicket,
        isSoundEnabled,
        setIsSoundEnabled,
        kpis,
        issueTicket,
        callNextTicket,
        recallTicket,
        completeServingTicket,
        skipServingTicket,
        transferServingTicket,
        submitTicketRating,
        dismissEvaluation,
        resetDemoData,
        injectRandomCitizen,
      }}
    >
      {children}
    </QmsContext.Provider>
  );
}

export function useQms() {
  const context = useContext(QmsContext);
  if (!context) {
    throw new Error('useQms must be used within a QmsProvider');
  }
  return context;
}
