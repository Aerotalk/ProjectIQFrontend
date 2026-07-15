import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ticketSchema, type TicketFormValues } from '../../../services/ticket.service';

export const useTicketForm = (defaultValues?: Partial<TicketFormValues>) => {
  return useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: '',
      description: '',
      client: '',
      clientContact: '',
      projectId: '',
      category: 'Complaint',
      priority: 'Low',
      status: 'Open',
      assigned: '',
      supportingMember: '',
      finalRemarks: '',
      ...defaultValues,
    },
    mode: 'onChange',
  });
};
