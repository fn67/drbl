export interface EmployeeValidationResult {
  active: boolean
}

export async function validateEmployee(email: string): Promise<EmployeeValidationResult> {
  console.log('[validate-employee] checking:', email)
  const active = email.endsWith('@company.com')
  console.log('[validate-employee] result:', { email, active })
  return { active }
}
