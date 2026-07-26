import { createCollection } from "@/data/store"
import { createEmployeeSeed } from "@/mock/employees"
import type { Employee, EmployeeFormValues } from "@/schemas/employee"

const employees = createCollection<Employee, EmployeeFormValues>(
  "cas.employees",
  createEmployeeSeed
)

export function getEmployees() {
  return employees.list()
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

export function resetEmployees() {
  return employees.reset()
}
