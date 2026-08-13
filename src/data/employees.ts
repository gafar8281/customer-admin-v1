import { createCollection } from "@/data/store"
import type { Employee, EmployeeFormValues } from "@/schemas/employee"

const employees = createCollection<Employee, EmployeeFormValues>("employees")

export function subscribeEmployees(
  onData: (items: Employee[]) => void,
  onError: (error: Error) => void
) {
  return employees.subscribe(onData, onError)
}

export function createEmployee(input: EmployeeFormValues) {
  return employees.create(input)
}

export function updateEmployee(id: string, input: EmployeeFormValues) {
  return employees.update(id, input)
}

export function deleteEmployee(id: string) {
  return employees.remove(id)
}
