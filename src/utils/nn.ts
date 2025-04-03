export function nn<T>(value: T | undefined | null, message?: string): T
{
  if (value === undefined || value === null)
  {
    throw new Error(message ?? "Unexpected null or undefined value");
  }

  return value;
}
