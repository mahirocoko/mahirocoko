# State and Data Rules

- Separate server state from UI state
- Use one server-state approach consistently across features
- Use one local-state approach consistently across features
- Keep API calls in service modules
- Keep shared providers in root shell

## Option Matrix

- Server state: React Query / SWR / Apollo / RTK Query
- Local state: Context / Zustand / Redux Toolkit / Jotai
- Forms: React Hook Form / Formik / native forms (project standard only)

## Example: Service + Hook Boundary

```ts
// services/employee-service.ts
export async function listEmployees() {
  const response = await fetch('/api/employees')
  if (!response.ok) {
    throw new Error('Failed to fetch employees')
  }
  return response.json()
}
```

```ts
// hooks/use-employees.ts
import { listEmployees } from '@/services/employee-service'

export function useEmployees() {
  return {
    queryKey: ['employees'],
    queryFn: listEmployees,
  }
}
```
