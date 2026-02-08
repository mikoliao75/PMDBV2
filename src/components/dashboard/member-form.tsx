
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTeamManagement } from '@/lib/team-management';
import { Member } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  name: z.string().min(2, { message: '姓名至少需要 2 個字元。' }),
  role: z.enum(['Manager', 'Member'], { required_error: '角色為必填項。' }),
  weeklyWorkHoursLimit: z.preprocess(
    (val) => Number(val),
    z.number().min(1, '週工時下限為 1').max(100, '週工時上限為 100')
  ),
});

interface MemberFormProps {
  member?: Member;
  onFinished?: () => void; 
}

export function MemberForm({ member, onFinished }: MemberFormProps) {
  const { addMember, updateMember, isSubmitting } = useTeamManagement();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name || '',
      role: member?.role || 'Member',
      weeklyWorkHoursLimit: member?.weeklyWorkHoursLimit || 40,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (member) {
      await updateMember(member.id, values);
    } else {
      await addMember(values as Omit<Member, 'id' | 'avatar' | 'projects'>);
    }
    onFinished?.(); // Callback to close dialog
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder="例如：王小明" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>角色</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="選擇一個角色" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Manager">主管 (Manager)</SelectItem>
                        <SelectItem value="Member">部屬 (Member)</SelectItem>
                    </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weeklyWorkHoursLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>週工時上限</FormLabel>
              <FormControl>
                <Input type="number" placeholder="例如：40" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '儲存中...' : '確認送出'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
