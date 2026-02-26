# State and Data Rules

- Separate server state from UI state
- Keep one server-state approach across features (prefer React Query if already used)
- Keep one local-state approach across features (prefer Zustand for app-level shared state)
- Keep API calls in service modules (Supabase or BaseService boundaries)
- Keep shared providers in root shell
- Keep auth token/session synchronization centralized (hook/store), not spread in pages

## Option Matrix

- Server state: React Query / SWR / Apollo / RTK Query
- Local state: Context / Zustand / Redux Toolkit / Jotai
- Forms: React Hook Form / Formik / native forms (project standard only)

## Example: Service + Hook Boundary

```ts
// services/goal.ts
import { supabase } from '@/services/supabase'

export class GoalService {
  static async getAll() {
    const { data, error } = await supabase.from('goals').select('*')
    if (error) throw error
    return data ?? []
  }
}
```

```ts
// hooks/use-goals.ts
import { useQuery } from '@tanstack/react-query'
import { GoalService } from '@/services/goal'

export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: () => GoalService.getAll(),
  })
}
```
