import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ticketSchema, type TicketFormValues } from '../../../services/ticket.service';

export const useTicketForm = (defaultValues?: Partial<TicketFormValues>) => {
  return useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      projectId: '',
      shortDescription: '',
      state: 'Open',
      priority: 'Low',
      description: '',
      ...defaultValues,
    },
    mode: 'onChange',
  });
};
